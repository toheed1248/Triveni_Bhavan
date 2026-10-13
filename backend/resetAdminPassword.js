
require('dotenv').config();

const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function resetAdminPassword() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const newPassword = process.env.RESET_ADMIN_PASSWORD;

    if (!process.env.MONGODB_URI || !email || !newPassword) {
      throw new Error(
        'MONGODB_URI, ADMIN_EMAIL and RESET_ADMIN_PASSWORD are required'
      );
    }

    if (newPassword.length < 12) {
      throw new Error('Use a new password with at least 12 characters');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    }).select('+password');

    if (!admin) {
      throw new Error(
        'Admin account not found. No account was created.'
      );
    }

    admin.password = newPassword;
    await admin.save();

    console.log('Admin password reset successfully.');
    console.log('You can now log in using the configured admin email.');
  } catch (error) {
    console.error('Password reset failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
    rl.close();
  }
}

resetAdminPassword();
