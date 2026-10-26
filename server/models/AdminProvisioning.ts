import { Schema, model } from 'mongoose';

const AdminProvisioningSchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provisionedAt: { type: Date, required: true, default: Date.now },
  },
  { versionKey: false }
);

export const AdminProvisioning = model('AdminProvisioning', AdminProvisioningSchema);
