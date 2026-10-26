import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { verifySession } from '../security/jwt';

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        role: 'customer' | 'admin';
        email: string;
      };
    }
  }
}

function requestToken(req: Request): string | undefined {
  const authorization = req.get('authorization');
  if (authorization?.startsWith('Bearer ')) return authorization.slice(7);
  return req.get('cookie')
    ?.split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith('elan_session='))
    ?.slice('elan_session='.length);
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const claims = requestToken(req);
  const session = claims ? verifySession(claims) : null;
  if (!session) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }
  try {
    const user = await User.findById(session.sub).select('_id email role tokenVersion');
    if (!user || user.tokenVersion !== session.ver) {
      res.status(401).json({ success: false, message: 'Session is invalid or expired.' });
      return;
    }
    req.authUser = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.authUser?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Administrator access required.' });
    return;
  }
  next();
}
