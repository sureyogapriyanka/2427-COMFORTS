import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: 'customer' | 'admin';
  tokenVersion: number;
  phone?: string;
  cart: Array<{
    catalogId: string;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
  }>;
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    isDefault: boolean;
  }>;
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    tokenVersion: { type: Number, default: 0 },
    phone: { type: String, trim: true },
    cart: [
      {
        catalogId: { type: String, required: true },
        selectedSize: { type: String, required: true },
        selectedColor: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1, max: 99 },
      },
    ],
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [{ type: String }],
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
