import mongoose from "mongoose";

const financeRecordSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"]
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null
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

    amount: {
      type: Number,
      required: [true, "Amount is required"]
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },

    category: {
      type: String,
      trim: true,
      default: ""
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer", "other"],
      default: "cash"
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    // فیلدهای جدید برای آپلود فایل
    receiptFile: {
      type: String,
      default: null
    },

    receiptFileName: {
      type: String,
      default: null
    },

    receiptFileType: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// ایندکس‌ها
financeRecordSchema.index({ teacher: 1, date: -1 });
financeRecordSchema.index({ teacher: 1, type: 1 });
financeRecordSchema.index({ teacher: 1, company: 1 });

const FinanceRecord = mongoose.model("FinanceRecord", financeRecordSchema);
export default FinanceRecord;