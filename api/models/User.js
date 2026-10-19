import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password by default
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    horoscopeProfile: {
      birthDate: { type: String, default: '' },
      lagna: { type: String, default: '' },
      navamshaka: { type: String, default: '' },
      planetaryPositions: {
        guru: { type: Number, default: null },   // Jupiter
        kuja: { type: Number, default: null },   // Mars
        sikuru: { type: Number, default: null }, // Venus
        ravi: { type: Number, default: null },   // Sun
        budha: { type: Number, default: null },  // Mercury
        rahu: { type: Number, default: null },   // Rahu
        senasuru: { type: Number, default: null },// Saturn
        sandu: { type: Number, default: null },  // Moon
        ketu: { type: Number, default: null },   // Ketu
      },
      selectedTopics: [{ type: String }],
      report: { type: String, default: '' },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent model re-compilation in hot-reload environments
export default mongoose.models.User || mongoose.model('User', UserSchema);
