import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"]
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    dueDate: {
      type: Date
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const ToDo = mongoose.model("ToDo", todoSchema);
export default ToDo;
