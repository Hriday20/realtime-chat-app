import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },

    sender: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model(
  "Message",
  messageSchema
);

export default Message;