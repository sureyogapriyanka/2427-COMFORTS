import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ success: false, message: 'Request validation failed.' });
    return;
  }
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ success: false, message: 'Invalid identifier.' });
    return;
  }
  if (error?.code === 11000) {
    res.status(409).json({ success: false, message: 'A record with these details already exists.' });
    return;
  }
  if (error?.type === 'entity.too.large') {
    res.status(413).json({ success: false, message: 'Request body is too large.' });
    return;
  }
  console.error('[2427 API] Request failed:', error);
  res.status(500).json({ success: false, message: 'An unexpected server error occurred.' });
};
