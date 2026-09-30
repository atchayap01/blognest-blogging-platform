import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide post content'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt summary'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    featuredImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    },
    category: {
      type: String,
      required: [true, 'Please select or provide a category'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
PostSchema.index({ title: 'text', content: 'text', excerpt: 'text', category: 'text' });

export const Post = mongoose.model<IPost>('Post', PostSchema);
