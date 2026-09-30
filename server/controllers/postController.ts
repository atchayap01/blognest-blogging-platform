import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { AuthRequest } from '../middleware/authMiddleware';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, tag, author, sort, page = '1', limit = '12' } = req.query;

    const query: any = {};

    if (search) {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { excerpt: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (tag) {
      query.tags = { $in: [String(tag)] };
    }

    if (author) {
      if (mongoose.Types.ObjectId.isValid(String(author))) {
        query.author = author;
      }
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'popular') {
      sortOptions = { commentCount: -1, createdAt: -1 };
    }

    const pageNumber = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNumber = Math.max(1, parseInt(String(limit), 10) || 12);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email avatar role')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber) || 1,
      posts,
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve posts.',
    });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        message: 'Invalid blog post ID format.',
      });
      return;
    }

    const post = await Post.findById(id).populate('author', 'name email avatar role bio');

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
      return;
    }

    // Ensure accurate comment count
    const actualCommentsCount = await Comment.countDocuments({ post: post._id });
    if (post.commentCount !== actualCommentsCount) {
      post.commentCount = actualCommentsCount;
      await post.save();
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error: any) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve blog post.',
    });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'You must be logged in to create a post.',
      });
      return;
    }

    const { title, content, excerpt, featuredImage, category, tags } = req.body;

    if (!title || !content || !category) {
      res.status(400).json({
        success: false,
        message: 'Title, content, and category are required.',
      });
      return;
    }

    // Auto-generate excerpt if not provided
    const cleanExcerpt = excerpt && excerpt.trim() !== ''
      ? excerpt.trim()
      : content.replace(/[#*`_\[\]()]/g, '').slice(0, 160).trim() + '...';

    // Parse tags array
    let parsedTags: string[] = [];
    if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const defaultImages: Record<string, string> = {
      'Web Development': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'Design': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      'Tutorial': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
      'Career': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      'Lifestyle': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    };

    const finalImage = featuredImage && featuredImage.trim() !== ''
      ? featuredImage.trim()
      : defaultImages[category] || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';

    const post = await Post.create({
      title: title.trim(),
      content,
      excerpt: cleanExcerpt,
      featuredImage: finalImage,
      category: category.trim(),
      tags: parsedTags,
      author: req.user._id,
      commentCount: 0,
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name email avatar role'
    );

    res.status(201).json({
      success: true,
      message: 'Post created and published successfully!',
      post: populatedPost,
    });
  } catch (error: any) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create post.',
    });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'You must be logged in to update a post.',
      });
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        message: 'Invalid blog post ID.',
      });
      return;
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
      return;
    }

    // Verify ownership
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own posts.',
      });
      return;
    }

    const { title, content, excerpt, featuredImage, category, tags } = req.body;

    if (title) post.title = title.trim();
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt.trim();
    if (featuredImage !== undefined && featuredImage.trim() !== '') {
      post.featuredImage = featuredImage.trim();
    }
    if (category) post.category = category.trim();

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        post.tags = tags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        post.tags = tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      'author',
      'name email avatar role'
    );

    res.status(200).json({
      success: true,
      message: 'Post updated successfully!',
      post: updatedPost,
    });
  } catch (error: any) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update post.',
    });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'You must be logged in to delete a post.',
      });
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({
        success: false,
        message: 'Invalid blog post ID.',
      });
      return;
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
      return;
    }

    // Verify ownership
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own posts.',
      });
      return;
    }

    // Delete post and its comments from MongoDB
    await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ post: id });

    res.status(200).json({
      success: true,
      message: 'Post and associated comments deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete post.',
    });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categoriesWithCount = await Post.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categories = categoriesWithCount.map((item) => ({
      name: item._id,
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve categories.',
    });
  }
};
