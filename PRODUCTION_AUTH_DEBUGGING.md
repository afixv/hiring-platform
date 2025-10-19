# Production Auth Issues - Debugging Guide

## Masalah
Aplikasi aman di local tapi di production (Vercel) user di-kick ke login setelah berhasil login.

## Root Cause
Perbedaan antara local dan production dalam session persistence:

### Local (Development)
- Browser cache dan localStorage berfungsi normal
- Supabase session cookie tersimpan dengan sempurna
- No HTTPS certificate issues

### Production (Vercel)
- **Strict cookie policy** - Cookies mungkin di-block atau tidak persistent
- **HTTPS requirements** - Supabase session cookies harus `Secure` flag
- **Domain mismatch** - NEXT_PUBLIC_SUPABASE_URL mungkin tidak match deployment domain
- **Auth session lost** - Session tidak ter-restore setelah page load/refresh

## Solution Applied

### 1. ✅ Upgraded Supabase Client
Mengubah dari `createClient()` ke `createBrowserClient()` dari `@supabase/ssr`:
```typescript
// OLD (tidak persistent di production)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// NEW (persistent dengan SSR support)
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
```

**Kenapa?**
- `createBrowserClient` dari `@supabase/ssr` automatically handles:
  - Session persistence di localStorage
  - Cookie management yang proper untuk browser
  - HTTPS/secure cookie handling
  - Cross-tab session sync

### 2. ✅ Improved Auth Context
- Better error handling dan fallback ke user metadata
- Detailed console logging untuk debugging
- Role fallback dari JWT token jika database gagal

### 3. ✅ Smart ProtectedRoute
- **Tidak redirect saat role masih null** - Wait sampai role ter-load
- Avoid redirect loop dengan waiting untuk role fetch
- Console logging untuk trace flow

## Testing di Production

### Step 1: Clear Browser Data
1. Buka Vercel deployment link: `https://hiring-platform-lemon.vercel.app`
2. Buka DevTools (F12)
3. **Tab Application > Storage:**
   - Clear Cookies
   - Clear Local Storage
   - Clear Session Storage

### Step 2: Monitor Console Logs
1. Buka DevTools Console (F12)
2. Login dengan akun demo:
   - Email: `jobseeker@hiring.com`
   - Password: `password123`
3. Perhatikan log messages:

```
[Auth] Initializing auth state...
[Auth] Session found for user: jobseeker@hiring.com
[Auth] User profile loaded: jobseeker
[Auth] Auth initialization complete
[ProtectedRoute] Check: loading=false, auth=true, role=jobseeker, required=jobseeker
[ProtectedRoute] Role matched (jobseeker), rendering
```

### Step 3: Check Session Persistence
1. Login successfully
2. Refresh halaman (F5)
3. **Harus tetap logged in**, bukan redirect ke login

### Step 4: Monitor Network
1. Buka DevTools > Network
2. Login dan observe:
   - POST ke `/auth/v1/token` (login request) ✅
   - Session cookie harus di-set: `sb-*-auth-token` 
   - Refresh page harus restore session

## Environment Variables Checklist

Verifikasi di Vercel deployment settings:

```env
# Harus exact sama dengan Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://qrdarkyzhntolnpeewfc.supabase.co

# Harus exact sama dengan anon key dari Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

⚠️ **CRITICAL**: 
- Copy dari Supabase dashboard dengan EXACT (no typos)
- Redeploy setelah update env vars

## Debugging Logs

Jika masih ada redirect loop, check console logs:

| Log | Meaning | Action |
|-----|---------|--------|
| `Session found for user: ...` | ✅ Auth session OK | Good! |
| `No active session` | ❌ Session lost | Check cookies/storage |
| `User profile loaded: null` | ⚠️ Database fetch failed | Check RLS policies |
| `Role still loading, waiting` | ⏳ Normal, wait | Should resolve |
| `Role mismatch` | ❌ Wrong role redirect | Check user role in DB |
| `Not authenticated, redirecting to login` | ❌ Auth lost | Session problem |

## Common Issues & Solutions

### Issue 1: Redirect to Login After Successful Login
**Symptoms:**
- Login success (Toast appears)
- Immediately redirected to `/auth/login`

**Debug:**
```javascript
// Run di browser console
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
console.log('Has token:', !!session?.access_token);
```

**Solution:**
- Check if `NEXT_PUBLIC_SUPABASE_URL` matches actual Supabase project
- Verify anon key di Supabase is still valid (not revoked)
- Clear browser storage dan try again

### Issue 2: Session Lost After Page Refresh
**Symptoms:**
- Login works
- Refresh halaman → logged out again

**Debug:**
```javascript
// Check if localStorage persisting
console.log('localStorage:', localStorage.getItem('sb-*-auth-token'));
console.log('cookies:', document.cookie);
```

**Solution:**
- Cookies mungkin di-block by browser
- Check Privacy/Cookie settings di browser
- Verify domain matches in Supabase Dashboard

### Issue 3: Role is null
**Symptoms:**
- Session ada
- Tapi role tetap null
- Stuck di loading screen

**Debug:**
```javascript
// Check user profile
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', 'user-id-here')
  .single();

console.log('User:', data, 'Error:', error);
```

**Solution:**
- User mungkin belum ada di database `users` table
- Buat manual entry di Supabase dashboard
- Atau check RLS policies allow SELECT

## Deployment Checklist

Sebelum production:

- [ ] Install `@supabase/ssr` package (done)
- [ ] Update Supabase client ke `createBrowserClient`
- [ ] Test login di local dengan `npm run dev`
- [ ] Build aplikasi: `npm run build`
- [ ] Set environment variables di Vercel
- [ ] Redeploy aplikasi
- [ ] Clear browser cache/storage
- [ ] Test login di production
- [ ] Verify session persists after refresh
- [ ] Check console logs untuk errors

## Performance Notes

`createBrowserClient` dengan SSR support:
- **Pros:** Persistent sessions, automatic cookie handling, works with RSC
- **Cons:** Slightly larger JS bundle
- **Performance:** Negligible impact

## Next Steps

Jika masih ada issue:

1. **Check Vercel logs:**
   - Buka Vercel Dashboard
   - View deployment logs
   - Look for auth-related errors

2. **Check Supabase logs:**
   - Buka Supabase Dashboard
   - Check Auth logs
   - Check Database logs

3. **Network inspection:**
   - DevTools > Network
   - Filter by `auth`
   - Check status codes (should be 200, not 401/403)

---

**Modified Files:**
- `src/lib/supabase.ts` - Updated client initialization
- `src/context/AuthContext.tsx` - Added logging and fallback
- `src/components/ProtectedRoute.tsx` - Added logging and wait logic
- `src/app/page.tsx` - Improved redirect logic

**New Package:**
- `@supabase/ssr` - For proper session persistence
