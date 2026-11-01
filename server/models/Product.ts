import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  catalogId?: string;
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
  sizeInventory?: { size: string; quantity: number }[];
  lowStockThreshold: number;
  inventoryHistory?: {
    adminId: string;
    adminEmail: string;
    size: string;
    previousQuantity: number | null;
    newQuantity: number;
    reason: string;
    createdAt: Date;
  }[];
  badge?: 'Bestseller' | 'New' | 'Limited' | 'Multipack' | 'Offer' | 'Bundle Save 20%' | 'Bundle Value' | 'Special Offer';
  images: string[];
  description: string;
  features: string[];
  inStock: boolean;
  stockCount: number;
  isDemoContent: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    catalogId: { type: String, unique: true, sparse: true, index: true },
    sku: { type: String, required: true, unique: true, trim: true, maxlength: 40 },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    subtitle: { type: String, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true, maxlength: 180, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
    category: { type: String, required: true, trim: true, maxlength: 120 },
    price: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
    compareAt: { type: Number, min: 0, validate: Number.isSafeInteger },
    fabric: { type: String, required: true, trim: true, maxlength: 120 },
    fabricDetails: { type: String, trim: true, maxlength: 300 },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    sizeInventory: {
      type: [{
        _id: false,
        size: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
      }],
      default: undefined,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 1,
      max: 10000,
      validate: Number.isSafeInteger,
    },
    inventoryHistory: {
      type: [{
        _id: false,
        adminId: { type: String, required: true },
        adminEmail: { type: String, required: true },
        size: { type: String, required: true },
        previousQuantity: { type: Number, min: 0, validate: Number.isSafeInteger, default: null },
        newQuantity: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
        reason: { type: String, required: true, trim: true, maxlength: 300 },
        createdAt: { type: Date, required: true, default: Date.now },
      }],
      default: undefined,
    },
    badge: { type: String, enum: ['Bestseller', 'New', 'Limited', 'Multipack', 'Offer', 'Bundle Save 20%', 'Bundle Value', 'Special Offer'] },
    images: [{ type: String }],
    description: { type: String, required: true, maxlength: 5000 },
    features: [{ type: String }],
    inStock: { type: Boolean, default: false },
    stockCount: { type: Number, min: 0, validate: Number.isSafeInteger },
    isDemoContent: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', ProductSchema);
