import mongoose from "mongoose";

const dailyClassLogSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"]
    },

    classTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassTemplate",
      required: [true, "Class template is required"]
    },

    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      default: null
    },

    date: {
      type: Date,
      required: [true, "Date is required"]
    },

    attended: {
      type: Boolean,
      default: true
    },

    hoursTaught: {
      type: Number,
      default: 0,
      min: [0, "Hours cannot be negative"]
    },

    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// قبل از ذخیره، اگر کلاس تمپلیت قرارداد داشت، خودکار ست کن
dailyClassLogSchema.pre("save", async function(next) {
  if (this.classTemplate && !this.contract) {
    const ClassTemplate = mongoose.model("ClassTemplate");
    const classTemp = await ClassTemplate.findById(this.classTemplate).populate("contract");
    if (classTemp && classTemp.contract) {
      this.contract = classTemp.contract._id;
    }
  }
  next();
});

// ساعت تدریس دیگر داخل قرارداد ذخیره نمی‌شود (فیلدهای taughtHours/totalHours از مدل Contract حذف شده‌اند).
// هر جا لازم باشد، از روی لاگ‌ها و کلاس‌ها محاسبه می‌شود.

const DailyClassLog = mongoose.model("DailyClassLog", dailyClassLogSchema);
export default DailyClassLog;