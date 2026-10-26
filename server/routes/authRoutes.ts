import { NextFunction, Request, Response, Router } from 'express';
import { User } from '../models/User';
import { authenticate } from '../middleware/authMiddleware';
import { hashPassword, isStrongPassword, verifyPassword } from '../security/password';
import { signSession } from '../security/jwt';

export const authRouter = Router();
const SESSION_COOKIE = 'elan_session';

function setSessionCookie(res: Response, token: string) {
  const secure = process.env.NODE_ENV === 'production';
  res.append('Set-Cookie', `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800${secure ? '; Secure' : ''}`);
}

function clearSessionCookie(res: Response) {
  const secure = process.env.NODE_ENV === 'production';
  res.append('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`);
}

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ success: false, message: 'Enter a valid name and email address.' });
      return;
    }
    if (!isStrongPassword(password)) {
      res.status(400).json({ success: false, message: 'Password must be 12–128 characters and include letters and numbers.' });
      return;
    }
    const user = await User.create({
      name,
      email,
      passwordHash: await hashPassword(password),
      role: 'customer',
    });
    setSessionCookie(res, signSession(user.id, user.tokenVersion));
    res.status(201).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length === 0 || password.length > 128) {
      res.status(400).json({ success: false, message: 'Enter a valid email and password.' });
      return;
    }
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
      return;
    }
    setSessionCookie(res, signSession(user.id, user.tokenVersion));
    res.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.authUser?.id).select('_id name email role phone addresses');
    if (!user) {
      res.status(401).json({ success: false, message: 'Account not found.' });
      return;
    }
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.patch('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates: Record<string, unknown> = {};
    if (req.body?.name !== undefined) {
      if (typeof req.body.name !== 'string' || req.body.name.trim().length < 2 || req.body.name.trim().length > 100) {
        res.status(400).json({ success: false, message: 'Name must be between 2 and 100 characters.' });
        return;
      }
      updates.name = req.body.name.trim();
    }
    if (req.body?.phone !== undefined) {
      if (
        typeof req.body.phone !== 'string' ||
        (req.body.phone.trim() !== '' && !/^[+0-9 ()-]{7,20}$/.test(req.body.phone.trim()))
      ) {
        res.status(400).json({ success: false, message: 'Enter a valid phone number.' });
        return;
      }
      updates.phone = req.body.phone.trim();
    }
    if (req.body?.addresses !== undefined) {
      const addresses = req.body.addresses;
      const validAddresses = Array.isArray(addresses) && addresses.length <= 10 &&
        addresses.every((address: Record<string, unknown>) =>
          address &&
          ['street', 'city', 'state', 'postalCode'].every((key) =>
            typeof address[key] === 'string' &&
            (address[key] as string).trim().length > 0 &&
            (address[key] as string).trim().length <= 200
          ) &&
          (address.isDefault === undefined || typeof address.isDefault === 'boolean')
        );
      if (!validAddresses) {
        res.status(400).json({ success: false, message: 'Address data is invalid.' });
        return;
      }
      updates.addresses = addresses.map((address: Record<string, unknown>) => ({
        street: (address.street as string).trim(),
        city: (address.city as string).trim(),
        state: (address.state as string).trim(),
        postalCode: (address.postalCode as string).trim(),
        isDefault: address.isDefault === true,
      }));
    }
    if (!Object.keys(updates).length) {
      res.status(400).json({ success: false, message: 'No profile fields were provided.' });
      return;
    }
    const user = await User.findByIdAndUpdate(req.authUser?.id, { $set: updates }, { new: true, runValidators: true })
      .select('_id name email role phone addresses');
    if (!user) {
      res.status(404).json({ success: false, message: 'Account not found.' });
      return;
    }
    res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, addresses: user.addresses } });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.updateOne({ _id: req.authUser?.id }, { $inc: { tokenVersion: 1 } });
    clearSessionCookie(res);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
