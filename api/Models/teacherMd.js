import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Teacher name is required"],
      trim: true
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    specialization: {
      type: String,
      trim: true
    },

    notes: {
      type: String,
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required"]
    },

    role: {
      type: String,
      enum: ["teacher", "admin"],
      default: "teacher"
    },

    // ✅ فیلدهای جدید اشتراک
    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free"
      },
      status: {
        type: String,
        enum: ["active", "expired", "cancelled", "pending"],
        default: "pending"
      },
      startDate: {
        type: Date,
        default: null
      },
      endDate: {
        type: Date,
        default: null
      },
      paymentId: {
        type: String,
        default: null
      }
    },

    // تنظیمات کاربر
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      pushNotifications: {
        type: Boolean,
        default: true
      }
    }
  },
  { timestamps: true }
);

// متد برای بررسی فعال بودن اشتراک
teacherSchema.methods.isSubscriptionActive = function() {
  if (!this.subscription.endDate) return false;
  return this.subscription.status === "active" && new Date() < this.subscription.endDate;
};

// متد برای دریافت روزهای باقی مانده اشتراک
teacherSchema.methods.getRemainingDays = function() {
  if (!this.subscription.endDate) return 0;
  const diff = new Date(this.subscription.endDate) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// متد برای بررسی دسترسی به یک ویژگی خاص
teacherSchema.methods.hasAccess = function(feature) {
  if (!this.isSubscriptionActive()) return false;
  
  const accessMap = {
    createCompany: ["pro", "enterprise"],
    createContract: ["pro", "enterprise"],
    createClass: ["pro", "enterprise"],
    createFinance: ["pro", "enterprise"],
    exportReports: ["pro", "enterprise"],
    unlimitedContracts: ["pro", "enterprise"]
  };
  
  const requiredPlans = accessMap[feature];
  if (!requiredPlans) return true;
  
  return requiredPlans.includes(this.subscription.plan);
};

// ایندکس‌ها
teacherSchema.index({ phone: 1 });
teacherSchema.index({ username: 1 });
teacherSchema.index({ "subscription.status": 1 });
teacherSchema.index({ "subscription.endDate": 1 });

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;