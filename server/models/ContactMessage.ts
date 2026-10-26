import { Schema, model, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    topic: { type: String, required: true, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { timestamps: true }
);

export const ContactMessage = model<IContactMessage>('ContactMessage', ContactMessageSchema);
