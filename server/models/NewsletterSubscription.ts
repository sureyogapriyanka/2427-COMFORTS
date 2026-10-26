import { Schema, model, Document } from 'mongoose';

export interface INewsletterSubscription extends Document {
  email: string;
  consentedAt: Date;
}

const NewsletterSubscriptionSchema = new Schema<INewsletterSubscription>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 254 },
    consentedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export const NewsletterSubscription = model<INewsletterSubscription>('NewsletterSubscription', NewsletterSubscriptionSchema);
