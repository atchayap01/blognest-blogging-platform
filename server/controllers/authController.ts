import { Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
      return;
    }

    // Check existing email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
      return;
    }

    // Default avatar based on initials
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=2563eb&color=fff&bold=true`;

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      avatar,
      bio: 'Writing stories on BlogNest.',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch current user profile.',
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized.',
      });
      return;
    }

    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);
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
      message: error.message || 'Failed to update profile.',
    });
  }
};
