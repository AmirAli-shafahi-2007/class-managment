import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"]
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"]
    },

    title: {
      type: String,
      required: [true, "Contract title is required"],
      trim: true
    },

    hourlyRate: {
      type: Number,
      required: [true, "Hourly rate is required"],
      min: [0, "Hourly rate cannot be negative"],
      default: 0
    },

    // ❌ حذف شده: totalHours, taughtHours, totalAmount, paidAmount

    startDate: {
      type: Date,
      required: [true, "Start date is required"]
    },

    endDate: {
      type: Date
    },

    status: {
      type: String,
      enum: ["active", "finished", "cancelled"],
      default: "active"
    },

    notes: {
      type: String,
      trim: true
    },

    contractFile: {
      type: String,
      default: null
    },

    contractFileName: {
      type: String,
      default: null
    },

    contractFileType: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// ❌ حذف شده: pre save middleware برای محاسبه totalAmount
// ❌ حذف شده: updateTaughtHours, updatePaidAmount, getProgressByHours, getProgressByAmount

// ایندکس‌ها
contractSchema.index({ teacher: 1 });
contractSchema.index({ company: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ startDate: 1 });
contractSchema.index({ endDate: 1 });

const Contract = mongoose.model("Contract", contractSchema);
export default Contract;