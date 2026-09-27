import Teacher from "../Models/teacherMd.js";
import { catchAsync } from "vanta-api";
import axios from "axios";
import { getZarinpalConfig } from "../config/zarinpal.js";

// پلن‌های قابل خرید (قیمت‌ها به تومان)
// فقط همین‌ها از سمت کاربر قابل درخواست هستند؛ هر دو دسترسی «pro» را فعال می‌کنند.
// قیمت این‌ها باید با صفحه‌ی قیمت‌ها (PricingPage.jsx) یکی باشد.
const PLANS = {
  monthly: { name: "اشتراک ماهانه", price: 199000, days: 30 },
  yearly: { name: "اشتراک سالانه", price: 1990000, days: 365 }
};

// زرین‌پال به‌صورت پیش‌فرض ریال می‌گیرد
const toRial = (toman) => toman * 10;

// دریافت اطلاعات اشتراک کاربر
export const getSubscriptionInfo = catchAsync(async (req, res) => {
  const teacher = await Teacher.findById(req.user._id).select("subscription name email");

  const sub = teacher.subscription;

  // اشتراک پولی که هنوز معتبر است (status=active و تاریخ پایان نگذشته)
  const paidValid = teacher.isSubscriptionActive();

  // اگر status هنوز active است ولی تاریخ گذشته، منقضی حساب می‌شود
  // (لازم نیست منتظر اجرای دستی check-expired بمانیم)
  const status =
    sub.status === "active" && !paidValid ? "expired" : sub.status;

  // کاربر پلن رایگان (مثلاً تازه ثبت‌نام‌شده با status=pending) منقضی نیست
  // و باید با محدودیت‌های پلن رایگان از سیستم استفاده کند
  const isFree = sub.plan === "free" && status !== "expired";

  const isActive = paidValid || isFree;
  const remainingDays = teacher.getRemainingDays();

  // دوره‌ی آزمایشی = اشتراک فعال که هنوز هیچ پرداختی برایش ثبت نشده
  const isTrial = paidValid && !sub.paymentId;

  res.json({
    success: true,
    data: {
      plan: sub.plan,
      status,
      isActive,
      isTrial,
      remainingDays,
      startDate: teacher.subscription.startDate,
      endDate: teacher.subscription.endDate
    }
  });
});

// درخواست پرداخت به زرین‌پال
export const requestPayment = catchAsync(async (req, res) => {
  const { planId } = req.body;

  if (!planId) {
    return res.status(400).json({
      success: false,
      message: "planId is required"
    });
  }

  const plan = PLANS[planId];

  if (!plan) {
    return res.status(400).json({
      success: false,
      message: `پلن ${planId} معتبر نیست`
    });
  }

  const teacher = await Teacher.findById(req.user._id);

  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: "کاربر یافت نشد"
    });
  }

  const cfg = getZarinpalConfig();

  // metadata فقط با مقدار معتبر ارسال شود (مقدار خالی باعث خطای اعتبارسنجی می‌شود)
  const metadata = {};
  if (teacher.email) metadata.email = teacher.email;
  if (/^09\d{9}$/.test(teacher.phone || "")) metadata.mobile = teacher.phone;

  const requestData = {
    merchant_id: cfg.merchantId,
    amount: toRial(plan.price),
    description: `خرید اشتراک ${plan.name} - ${teacher.name}`,
    callback_url: `${cfg.callbackUrl}?userId=${teacher._id}&planId=${planId}`,
    metadata
  };

  try {
    const response = await axios.post(cfg.requestUrl, requestData, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      timeout: 15000
    });

    const { data, errors } = response.data;

    if (data && data.code === 100 && data.authority) {
      return res.json({
        success: true,
        authority: data.authority,
        paymentUrl: `${cfg.paymentUrl}${data.authority}`
      });
    }

    console.error("Zarinpal request rejected:", JSON.stringify({ data, errors }));
    return res.status(400).json({
      success: false,
      message: "خطا در اتصال به درگاه پرداخت",
      code: errors?.code ?? data?.code
    });
  } catch (error) {
    // زرین‌پال در خطاهای اعتبارسنجی، status 4xx همراه با بدنه‌ی errors برمی‌گرداند
    const zpErrors = error.response?.data?.errors;
    console.error(
      "Zarinpal request error:",
      error.response?.status,
      zpErrors ? JSON.stringify(zpErrors) : error.message
    );
    return res.status(500).json({
      success: false,
      message: "خطا در اتصال به درگاه پرداخت",
      code: zpErrors?.code
    });
  }
});

// تایید پرداخت (کالبک از زرین‌پال)
export const verifyPayment = catchAsync(async (req, res) => {
  const { Authority, Status, userId, planId } = req.query;
  const cfg = getZarinpalConfig();
  const frontendUrl = cfg.clientUrl;

  if (Status !== "OK" || !Authority) {
    return res.redirect(`${frontendUrl}/pricing?payment=failed`);
  }

  const plan = PLANS[planId];
  if (!plan) {
    return res.redirect(`${frontendUrl}/pricing?payment=invalid`);
  }

  try {
    const response = await axios.post(
      cfg.verifyUrl,
      {
        merchant_id: cfg.merchantId,
        authority: Authority,
        amount: toRial(plan.price)
      },
      {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        timeout: 15000
      }
    );

    const { data, errors } = response.data;
    const code = data?.code;

    // 101 یعنی این تراکنش قبلاً وریفای شده (مثلاً رفرش صفحه کالبک)
    if (code === 101) {
      const teacher = await Teacher.findById(userId).select("subscription");
      if (teacher?.subscription?.paymentId === Authority) {
        return res.redirect(`${frontendUrl}/pricing?payment=success`);
      }
      return res.redirect(`${frontendUrl}/pricing?payment=failed`);
    }

    if (code === 100) {
      const teacher = await Teacher.findById(userId).select("subscription");
      if (!teacher) {
        return res.redirect(`${frontendUrl}/pricing?payment=failed`);
      }

      const now = new Date();

      // اگر اشتراک/دوره‌ی آزمایشی هنوز فعال است، زمان جدید بعد از تاریخ پایانِ فعلی شروع می‌شود
      const currentEnd = teacher.subscription?.endDate;
      const stillActive =
        teacher.subscription?.status === "active" && currentEnd && currentEnd > now;
      const base = stillActive ? new Date(currentEnd) : now;

      const endDate = new Date(base);
      endDate.setDate(endDate.getDate() + plan.days);

      await Teacher.findByIdAndUpdate(userId, {
        "subscription.plan": "pro",
        "subscription.status": "active",
        "subscription.startDate": now,
        "subscription.endDate": endDate,
        "subscription.paymentId": Authority
      });

      return res.redirect(`${frontendUrl}/pricing?payment=success`);
    }

    console.error("Zarinpal verify rejected:", JSON.stringify({ data, errors }));
    return res.redirect(`${frontendUrl}/pricing?payment=failed`);
  } catch (error) {
    console.error(
      "Zarinpal verify error:",
      error.response?.status,
      error.response?.data?.errors
        ? JSON.stringify(error.response.data.errors)
        : error.message
    );
    return res.redirect(`${frontendUrl}/pricing?payment=error`);
  }
});

// انقضای اشتراک‌ها
export const checkExpiredSubscriptions = catchAsync(async (req, res) => {
  const now = new Date();

  const result = await Teacher.updateMany(
    {
      "subscription.status": "active",
      "subscription.endDate": { $lt: now }
    },
    {
      "subscription.status": "expired",
      "subscription.plan": "free"
    }
  );

  res.json({
    success: true,
    message: `${result.modifiedCount} اشتراک منقضی شد`
  });
});