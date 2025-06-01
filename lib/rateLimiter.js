const RATE_LIMIT = 3; // Maximum number of attempts allowed
const WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Store to keep track of IP addresses and their usage
const ipRequests = new Map();

export function checkRateLimit(ip) {
  // Get current timestamp
  const now = Date.now();
  
  // Get existing data for this IP or create new data
  const userData = ipRequests.get(ip) || { 
    count: 0, 
    resetTime: now + WINDOW 
  };
  
  // Check if 24 hours have passed since last reset
  if (now > userData.resetTime) {
    // Reset the counter if 24 hours have passed
    userData.count = 0;
    userData.resetTime = now + WINDOW;
  }
  
  // Check if user has exceeded their limit
  if (userData.count >= RATE_LIMIT) {
    return {
      allowed: false,          // Not allowed to make more requests
      remaining: 0,            // No attempts remaining
      resetTime: userData.resetTime  // When they can try again
    };
  }
  
  // If allowed, increment their attempt count
  userData.count++;
  ipRequests.set(ip, userData);
  
  // Return success with remaining attempts
  return {
    allowed: true,
    remaining: RATE_LIMIT - userData.count,
    resetTime: userData.resetTime
  };
} 