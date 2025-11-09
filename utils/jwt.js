import jsonwt from 'jsonwebtoken';
import config from '../config/index.js';
import { createAppError } from '../utils/createAppError.js';

export const generateToken = (payload) => {
  return new Promise((resolve, reject) => {
    jsonwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
      (err, token) => {
        if (err) reject(createAppError(500, 'Token generation failed', 'auth'));
        resolve(token);
      }
    );
  });
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jsonwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) reject(createAppError(403, 'Invalid token', 'auth'));
      resolve(decoded);
    });
  });
};
