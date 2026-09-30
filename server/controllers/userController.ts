import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        message: 'Invalid user ID.',
      });
      return;
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'name email avatar role');

    res.status(200).json({
      success: true,
      user,
      postsCount: posts.length,
      posts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve user profile.',
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'You must be logged in to update user profile.',
      });
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        message: 'Invalid user ID.',
      });
      return;
    }

    // Verify ownership
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own profile.',
      });
      return;
    }

    const { name, bio, avatar } = req.body;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user profile.',
    });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized.',
      });
      return;
    }

    const userId = req.user._id;

    // Get all posts authored by this user
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'name email avatar role');

    const postIds = posts.map((p) => p._id);

    // Count total comments received on user's posts
    const totalCommentsReceived = await Comment.countDocuments({
      post: { $in: postIds },
    });

    // Recent comments received on user's posts
    const recentComments = await Comment.find({ post: { $in: postIds } })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('author', 'name email avatar')
      .populate('post', 'title');

    res.status(200).json({
      success: true,
      stats: {
        totalPosts: posts.length,
        totalCommentsReceived,
      },
      posts,
      recentComments,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard statistics.',
    });
  }
};
