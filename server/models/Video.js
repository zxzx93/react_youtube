const mongoose = require('mongoose');
const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const videoSchema = mongoose.Schema(
  {
    writer: {
      type: ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    privacy: {
      type: Number,
    },
    filePath: {
      type: String,
    },
    category: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true },
);

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };
