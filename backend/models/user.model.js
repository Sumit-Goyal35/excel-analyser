import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uploadHistory: [
      {
        fileId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ExcelData",
        },
        fileName: String,
        originalName: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        fileSize: Number,
        chartTypesUsed: [
          {
            type: String,
            enum: ["bar", "line", "pie", "scatter", "3d-column"],
          },
        ],
        analysisCount: {
          type: Number,
          default: 0,
        },
        lastAnalyzed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // User statistics for admin tracking
    totalUploads: {
      type: Number,
      default: 0,
    },
    totalDataUsage: {
      type: Number,
      default: 0, // in bytes
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    downloadHistory: [
      {
        chartType: String,
        downloadFormat: String, // 'png' or 'pdf'
        downloadDate: { type: Date, default: Date.now },
        fileName: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update user statistics
userSchema.methods.updateStats = async function() {
  this.totalUploads = this.uploadHistory.length;
  this.totalDataUsage = this.uploadHistory.reduce((total, upload) => total + (upload.fileSize || 0), 0);
  await this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
