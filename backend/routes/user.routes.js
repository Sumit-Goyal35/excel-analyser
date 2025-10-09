import express from 'express';
import User from '../models/user.model.js';
import ExcelData from '../models/excelData.model.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/users/profile
// @desc    Get user profile with detailed upload history
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('uploadHistory.fileId', 'originalName rowCount columns');
    
    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/upload-history
// @desc    Get detailed upload history
// @access  Private
router.get('/upload-history', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id);
    
    const totalUploads = user.uploadHistory.length;
    const uploads = user.uploadHistory
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
      .slice(skip, skip + limit);

    // Get additional file details
    const detailedUploads = await Promise.all(
      uploads.map(async (upload) => {
        const fileDetails = await ExcelData.findById(upload.fileId)
          .select('originalName rowCount columns sheetNames createdAt');
        
        return {
          ...upload.toObject(),
          fileDetails
        };
      })
    );

    res.json({
      uploads: detailedUploads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUploads / limit),
        totalUploads,
        hasNext: page < Math.ceil(totalUploads / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get upload history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const { name } = req.body;
    
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/upload/:fileId
// @desc    Delete user's uploaded file
// @access  Private
router.delete('/upload/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    // Remove from ExcelData collection
    await ExcelData.findOneAndDelete({
      _id: fileId,
      userId: req.user._id
    });

    // Remove from user's upload history
    const user = await User.findById(req.user._id);
    user.uploadHistory = user.uploadHistory.filter(
      upload => upload.fileId.toString() !== fileId
    );
    await user.updateStats();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
