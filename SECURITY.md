# Security Configuration

## Critical Security Hotfix - Rate Limiting Implementation

This hotfix addresses a critical security vulnerability where authentication endpoints were not protected against brute force attacks.

### Changes Made

#### 1. Rate Limiting Middleware (`src/middleware/rateLimiter.js`)
- **Authentication endpoints**: 5 attempts per 15 minutes
- **Registration endpoint**: 3 attempts per hour  
- **Password changes**: 2 attempts per hour
- **General API**: 100 requests per 15 minutes

#### 2. Security Headers Added
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Rate-Limit-Policy: active`

#### 3. Enhanced Key Generation
- Combines IP address and User-Agent for better tracking
- Uses email for password reset attempts to prevent per-user abuse

### Risk Mitigation

**Before this hotfix:**
- ❌ Unlimited authentication attempts allowed
- ❌ No protection against automated attacks
- ❌ Potential for account takeover via brute force
- ❌ No rate limiting on registration (spam vulnerability)

**After this hotfix:**
- ✅ Brute force attacks prevented with strict rate limiting
- ✅ DDoS protection through request throttling
- ✅ Enhanced security headers protect against common attacks
- ✅ Registration spam prevented
- ✅ Password reset abuse prevented

### Deployment Notes

1. **Immediate Deployment Required**: This is a critical security fix
2. **No Breaking Changes**: All existing functionality preserved
3. **New Dependency**: `express-rate-limit@^7.1.5` required
4. **Monitoring**: Rate limit headers provide visibility into usage

### Testing Checklist

- [ ] Authentication rate limiting triggers after 5 failed attempts
- [ ] Registration rate limiting triggers after 3 attempts per hour
- [ ] Password change rate limiting triggers after 2 attempts per hour
- [ ] Security headers are present in all responses
- [ ] Legitimate users can still access the system normally
- [ ] Rate limit headers are correctly returned

### Incident Response

If this hotfix causes issues:
1. Monitor rate limit headers for false positives
2. Adjust limits in `src/middleware/rateLimiter.js` if needed
3. Check server logs for rate limiting events
4. Verify User-Agent based key generation is working correctly

### Emergency Rollback

If immediate rollback is needed:
1. Remove rate limiting middleware from routes
2. Remove `generalLimiter` from `app.js`
3. Revert to previous commit before this hotfix

**Security Impact**: This hotfix prevents critical attack vectors and should be deployed immediately to production.