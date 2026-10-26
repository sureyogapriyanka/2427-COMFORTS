import { NextFunction, Request, Response } from 'express';

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }
  const hasSessionCookie = req.get('cookie')?.split(';')
    .some((entry) => entry.trim().startsWith('elan_session='));
  if (!hasSessionCookie) {
    next();
    return;
  }
  const origin = req.get('origin');
  const allowedOrigins = new Set(
    (process.env.CLIENT_ORIGINS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );
  const allowed = origin && (
    allowedOrigins.has(origin) ||
    (process.env.NODE_ENV !== 'production' &&
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
  );
  if (!allowed) {
    res.status(403).json({ success: false, message: 'Request origin is not allowed.' });
    return;
  }
  next();
}
