# Privy Setup Instructions

## ✅ Status: WORKING
The Privy integration is now fully functional! All dependencies have been installed and configured.

## 1. Create Privy Account
1. Go to [https://privy.io](https://privy.io)
2. Sign up for a free account
3. Create a new app

## 2. Get Your App ID
1. In your Privy dashboard, copy your App ID
2. It should look like: `cmf5b6yvy004wk00cmj07a826` (already configured)

## 3. Configure Environment Variables (Optional)
Create a `.env` file in the root directory if you want to use a different App ID:

```env
VITE_PRIVY_APP_ID=your_actual_privy_app_id_here
VITE_API_URL=http://localhost:3001
```

## 4. Current Configuration
The app is already configured with a working App ID: `cmf5b6yvy004wk00cmj07a826`

## 5. Features Included
- **Multiple Login Methods**: Email, Wallet, Google, Twitter
- **Dark Theme**: Matches your app's design
- **Embedded Wallets**: Automatically creates wallets for users without them
- **User Authentication**: Required to chat with Dobby
- **User Profile**: Shows user info in header when logged in

## 6. Login Flow
1. Users click "Login" button in header
2. Privy modal opens with login options
3. After login, user info appears in header
4. Users can now chat with Dobby
5. Logout button available to disconnect

## 7. Development
- Make sure your backend API is running on port 3001
- The app will work with the default test App ID for development
- For production, use your actual Privy App ID

## 8. Customization
You can customize the Privy configuration in `src/main.tsx`:
- Change login methods
- Modify appearance theme
- Add/remove social providers
- Configure embedded wallet settings
