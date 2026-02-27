# Authentication Methods Available

## Sign-Up Page Options

The sign-up page (`/sign-up`) now supports **all** of the following authentication methods:

### 1. **Google Sign-Up** 🔵
- One-click sign-up with Google account
- Appears as a button at the top of the sign-up form
- Requires Google OAuth to be enabled in Clerk Dashboard

### 2. **Apple Sign-Up** 🍎
- One-click sign-up with Apple ID
- Appears as a button at the top of the sign-up form
- Requires Apple OAuth to be enabled in Clerk Dashboard

### 3. **Email OTP Verification** 📧
- Sign up with email address
- Receive a one-time password (OTP) via email
- Enter OTP to verify and complete sign-up
- No password required for this method

### 4. **Email + Password** 🔐
- Traditional sign-up with email and password
- Set a password during sign-up
- Use email + password for future sign-ins

## How to Enable All Methods in Clerk Dashboard

### Step 1: Enable Social Connections (Google & Apple)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **"User & Authentication"** → **"Social Connections"**
3. For **Google**:
   - Click "Configure"
   - Add your Google OAuth credentials
   - ✅ Enable "Available for sign-up" toggle
   - Save
4. For **Apple**:
   - Click "Configure"
   - Add your Apple OAuth credentials
   - ✅ Enable "Available for sign-up" toggle
   - Save

### Step 2: Enable Email Authentication

1. Go to **"User & Authentication"** → **"Email, Phone, Username"**
2. Enable:
   - ✅ **Email** (with OTP verification)
   - ✅ **Password** (optional, for email/password flow)

### Step 3: Verify Configuration

Make sure all methods show:
- ✅ **Enabled** toggle is ON
- ✅ **Available for sign-up** toggle is ON (important!)

## Visual Layout

The sign-up page displays options in this order:

```
┌─────────────────────────────┐
│   Go For It                 │
│   Start your journey...     │
├─────────────────────────────┤
│  [Google Button]            │
│  [Apple Button]             │
│  ─────── or ───────         │
│  Email address              │
│  [Email Input]              │
│  [Continue Button]          │
│                             │
│  Already have an account?   │
│  Sign in                    │
└─────────────────────────────┘
```

## User Flow Examples

### Flow 1: Google Sign-Up
1. User clicks "Continue with Google"
2. Redirected to Google OAuth
3. User authorizes
4. Redirected back to app
5. Account created automatically
6. User data synced to MongoDB via webhook

### Flow 2: Email OTP Sign-Up
1. User enters email address
2. Clicks "Continue"
3. Receives OTP via email
4. Enters OTP code
5. Account created
6. User data synced to MongoDB via webhook

### Flow 3: Email + Password Sign-Up
1. User enters email address
2. Clicks "Continue"
3. Chooses "Set password" option
4. Enters password
5. Account created
6. User data synced to MongoDB via webhook

## Testing

1. Visit: `http://localhost:8080/sign-up`
2. You should see:
   - ✅ Google button (if enabled)
   - ✅ Apple button (if enabled)
   - ✅ Email input field
   - ✅ All styled with dark theme

3. Test each method:
   - Try Google sign-up
   - Try Apple sign-up
   - Try Email OTP
   - Try Email + Password

## Troubleshooting

**Google/Apple buttons not showing:**
- Verify they're enabled in Clerk Dashboard
- Check "Available for sign-up" is ON
- Clear browser cache
- Check browser console for errors

**Email OTP not working:**
- Verify Email is enabled in Clerk Dashboard
- Check email delivery settings
- Verify OTP is enabled for sign-up

**Password option not showing:**
- Enable Password in Clerk Dashboard
- Check "Available for sign-up" toggle

