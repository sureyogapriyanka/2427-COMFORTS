import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  title: string;
  slug: string;
  gender: 'men' | 'women' | 'both';
  tagline: string;
  description: string;
  image: string;
  orderIndex: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['men', 'women', 'both'], required: true },
    tagline: { type: String },
    description: { type: String },
    image: { type: String, required: true },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', CategorySchema);
