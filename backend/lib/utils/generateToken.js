import jwt from 'jsonwebtoken';
export const generateTokenAndSetCookie = (userId, res) => {
const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expiration time
  });

  // Set the token in a cookie
  res.cookie('token', token, {
    httpOnly: true, // Prevents client-side access to the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    samesite: 'Strict', // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration time (30 days)
  });

}