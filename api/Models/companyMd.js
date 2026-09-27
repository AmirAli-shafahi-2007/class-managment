import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true
    },

    managerName: {
      type: String,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    address: {
      type: String,
      trim: true
    },

    notes: {
      type: String,
      trim: true
    },
    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Teacher",
  required: true
}
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
