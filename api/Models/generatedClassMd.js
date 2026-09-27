import mongoose from "mongoose";

const generatedClassSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },
    classTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassTemplate",
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
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    dayOfWeek: {
      type: String,
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
    hoursTaught: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["pending", "attended", "absent"],
      default: "pending"
    },
    attended: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const GeneratedClass = mongoose.model("GeneratedClass", generatedClassSchema);
export default GeneratedClass;