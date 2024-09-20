const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  image: { type: String }, // Field for image upload
  reply: { type: String }, // Business owner's reply to the review
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track likes for the review
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
