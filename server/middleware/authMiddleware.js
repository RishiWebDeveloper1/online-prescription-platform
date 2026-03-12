import jwt from 'jsonwebtoken';

/**
 * JWT guard. Pass an array of allowed roles, e.g. protect(['doctor']).
 * An empty array allows any authenticated user.
 */
export const protect = (roles = []) => (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised — no token' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden — insufficient role' });
    }

    next();
  } catch {
    res.status(401).json({ message: 'Not authorised — invalid or expired token' });
  }
};
