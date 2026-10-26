import jwt from 'jsonwebtoken';
import db from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'paderu_sachivalayam_secure_token_secret_key_2026';

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired or invalid token. Please sign in again.' });
    }
    req.user = user;
    next();
  });
}

// Optional auth - populates req.user if token is present, does not block if not
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  });
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Log unauthorized attempt to audit log
      logAudit(req, 'UNAUTHORIZED_ACCESS_ATTEMPT', req.baseUrl + req.path, null, `User with role ${req.user.role} attempted to access restricted endpoint requiring [${allowedRoles.join(', ')}]`);
      return res.status(403).json({
        error: `Access Denied: Your role '${req.user.role}' is not authorized to access this record or action. Required role: ${allowedRoles.join(' or ')}.`
      });
    }

    next();
  };
}

export function logAudit(req, action, targetEntity, targetId = null, details = '') {
  try {
    const userId = req.user ? req.user.id : null;
    const username = req.user ? req.user.username : 'ANONYMOUS';
    const role = req.user ? req.user.role : 'Public';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const stmt = db.prepare(`
      INSERT INTO audit_logs (user_id, username, role, action, target_entity, target_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(userId, username, role, action, targetEntity, targetId ? String(targetId) : null, details, String(ip));
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}

// Utility to mask names: "Korra Somanna" -> "K**** S******"
export function maskName(name) {
  if (!name) return '***';
  return name.split(' ').map(part => {
    if (part.length <= 2) return part;
    return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
  }).join(' ');
}

// Utility to mask phone numbers: "9848011223" -> "98****1223"
export function maskPhone(phone) {
  if (!phone || phone.length < 6) return '****';
  return phone.slice(0, 2) + '*'.repeat(phone.length - 6) + phone.slice(-4);
}
