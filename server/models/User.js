const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  role: { type: String, default: 'user' }, // 'admin' or 'user'
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
