import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Comment } from '../models/Comment';
import { Post } from '../models/Post';
import { AuthRequest } from '../middleware/authMiddleware';

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(404).json({
        success: false,
        message: 'Invalid post ID.',
      });
      return;
    }

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name email avatar role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve comments.',
    });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'You must be logged in to leave a comment.',
      });
      return;
    }

    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty.',
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(404).json({
        success: false,
        message: 'Invalid post ID.',
      });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
      return;
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: req.user._id,
      post: post._id,
    });

    // Update post comment count
    const totalComments = await Comment.countDocuments({ post: post._id });
    post.commentCount = totalComments;
    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name email avatar role'
    );

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully.',
      comment: populatedComment,
      commentCount: totalComments,
    });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to post comment.',
    });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'You must be logged in to delete a comment.',
      });
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        message: 'Invalid comment ID.',
      });
      return;
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comment not found.',
      });
      return;
    }

    // Verify ownership
    const isOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own comments.',
      });
      return;
    }

    const postId = comment.post;
    await Comment.findByIdAndDelete(id);

    // Update post comment count
    const remainingCount = await Comment.countDocuments({ post: postId });
    await Post.findByIdAndUpdate(postId, { commentCount: remainingCount });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
      commentCount: remainingCount,
    });
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete comment.',
    });
  }
};
