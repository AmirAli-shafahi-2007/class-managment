// تنظیمات زرین‌پال (v4)
const ENDPOINTS = {
  sandbox: {
    requestUrl: "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
    verifyUrl: "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
    paymentUrl: "https://sandbox.zarinpal.com/pg/StartPay/",
  },
  production: {
    requestUrl: "https://api.zarinpal.com/pg/v4/payment/request.json",
    verifyUrl: "https://api.zarinpal.com/pg/v4/payment/verify.json",
    paymentUrl: "https://www.zarinpal.com/pg/StartPay/",
  },
};

const SANDBOX_MERCHANT_ID = "00000000-0000-0000-0000-000000000000";

// تابع است (نه آبجکت ثابت) چون dotenv در server.js بعد از import شدن این فایل لود می‌شود
// و اگر مقادیر را همان لحظه import بخوانیم، process.env هنوز خالی است.
export const getZarinpalConfig = () => {
  const mode = process.env.ZARINPAL_MODE === "production" ? "production" : "sandbox";
  const serverUrl = process.env.SERVER_URL || "http://localhost:5000";

  let merchantId = SANDBOX_MERCHANT_ID;
  if (mode === "production") {
    merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantId) {
      throw new Error("ZARINPAL_MERCHANT_ID برای حالت production تنظیم نشده است");
    }
  }

  return {
    mode,
    merchantId,
    ...ENDPOINTS[mode],
    callbackUrl: `${serverUrl}/api/subscription/verify`,
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  };
};