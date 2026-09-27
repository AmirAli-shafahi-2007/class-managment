import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      required: true
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true
    },
    totalHours: {
      type: Number,
      default: 0,
      min: 0
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0
    },
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ["pending", "partial", "paid", "overdue"],
      default: "pending"
    },
    dueDate: {
      type: Date,
      default: function() {
        const date = new Date(this.year, this.month, 0);
        date.setDate(date.getDate() + 10);
        return date;
      }
    },
    description: {
      type: String,
      default: ""
    },
    financeRecords: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinanceRecord"
    }]
  },
  { timestamps: true }
);

// محاسبه خودکار amount قبل از ذخیره
invoiceSchema.pre("save", function(next) {
  this.amount = this.totalHours * this.hourlyRate;
  next();
});

// متد برای گرفتن مبلغ باقی‌مانده
invoiceSchema.methods.getRemainingAmount = function() {
  return this.amount - this.paidAmount;
};

// متد برای آپدیت مبلغ پرداخت شده
invoiceSchema.methods.addPayment = async function(amount, financeRecordId) {
  this.paidAmount += amount;
  
  if (this.paidAmount >= this.amount) {
    this.status = "paid";
  } else if (this.paidAmount > 0) {
    this.status = "partial";
  }
  
  if (financeRecordId && !this.financeRecords.includes(financeRecordId)) {
    this.financeRecords.push(financeRecordId);
  }
  
  return this.save();
};

// ایندکس‌ها
invoiceSchema.index({ teacher: 1, year: 1, month: 1 });
invoiceSchema.index({ teacher: 1, company: 1 });
invoiceSchema.index({ contract: 1 });
invoiceSchema.index({ status: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;