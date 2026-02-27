// utils/auth.js
export function generateToken(user) {
    // A fake token with user info + timestamp
    return btoa(JSON.stringify({ ...user, exp: Date.now() + 60 * 60 * 1000 })); // 1h expiry
  }
  
  export function isTokenValid(token) {
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.exp > Date.now(); // check expiry
    } catch {
      return false;
    }
  }