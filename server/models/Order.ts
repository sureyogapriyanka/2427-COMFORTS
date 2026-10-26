import { Schema, model, Document, Types } from 'mongoose';

export interface IOrderItem {
  productId: Schema.Types.ObjectId;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  image: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: Types.ObjectId;
  guestEmail?: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    guestEmail: { type: String },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        sku: String,
        name: String,
        price: Number,
        quantity: Number,
        selectedColor: String,
        selectedSize: String,
        image: String,
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'India' },
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    trackingNumber: String,
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', OrderSchema);
