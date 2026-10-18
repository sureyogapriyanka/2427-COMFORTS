import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  subtitle: string;
  slug: string;
  gender: 'men' | 'women' | 'unisex';
  category: string;
  price: number;
  compareAt?: number;
  fabric: string;
  fabricDetails: string;
  colors: string[];
  sizes: string[];
  badge?: 'Bestseller' | 'New' | 'Limited' | 'Multipack' | 'Offer';
  images: string[];
  description: string;
  features: string[];
  inStock: boolean;
  stockCount: number;
  isDemoContent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subtitle: { type: String },
    slug: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    compareAt: { type: Number },
    fabric: { type: String, required: true },
    fabricDetails: { type: String },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    badge: { type: String, enum: ['Bestseller', 'New', 'Limited', 'Multipack', 'Offer'] },
    images: [{ type: String }],
    description: { type: String, required: true },
    features: [{ type: String }],
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 100 },
    isDemoContent: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', ProductSchema);
