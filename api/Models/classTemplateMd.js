import mongoose from "mongoose";

const classTemplateSchema = new mongoose.Schema(
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
      default: null
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    daysOfWeek: [{
      type: String,
      enum: ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"],
      required: true
    }],
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const ClassTemplate = mongoose.model("ClassTemplate", classTemplateSchema);
export default ClassTemplate;