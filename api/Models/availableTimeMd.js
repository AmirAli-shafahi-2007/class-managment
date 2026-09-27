import mongoose from "mongoose";

const availableTimeSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"]
    },

    dayOfWeek: {
      type: String,
      enum: [
        "saturday",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday"
      ],
      required: [true, "Day of week is required"]
    },

    startTime: {
      type: String, 
      required: [true, "Start time is required"]
    },

    endTime: {
      type: String, 
      required: [true, "End time is required"]
    }
  },
  { timestamps: true }
);

const AvailableTime = mongoose.model("AvailableTime", availableTimeSchema);
export default AvailableTime;
