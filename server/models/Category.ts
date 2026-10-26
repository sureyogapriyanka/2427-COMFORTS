import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  title: string;
  slug: string;
  gender: 'men' | 'women' | 'both';
  tagline: string;
  description: string;
  image: string;
  orderIndex: number;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, trim: true, maxlength: 120, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
    gender: { type: String, enum: ['men', 'women', 'both'], required: true },
    tagline: { type: String },
    description: { type: String },
    image: { type: String, required: true },
    orderIndex: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', CategorySchema);
