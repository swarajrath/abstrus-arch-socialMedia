const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minLength: [5, "A comment must be at least 5 characters long"],
      maxlength: [140, "A comment must be no more than 140 characters long"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    tweet: {
      type: mongoose.Schema.ObjectId,
      ref: "Tweet",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL FIELD FOR COMMENT PAGE
CommentSchema.virtual("profile", {
  ref: "Profile",
  localField: "user",
  foreignField: "user",
  justOne: true,
});

CommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "profile",
    select: "photo",
  });
  next();
});

module.exports = mongoose.model("Comment", CommentSchema);
