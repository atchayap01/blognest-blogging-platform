import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Please provide comment text'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
