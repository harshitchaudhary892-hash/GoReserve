# 🏨 Go Reserve

> Discover & Reserve Nearby Hotels, Resorts, Restaurants & Cafes

Built with **React Native (Expo)**, **Firebase**, and **Google Maps**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Expo](https://img.shields.io/badge/Expo-57-blue)](https://expo.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12-orange)](https://firebase.google.com)

---

## 📸 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Email/Password login, signup, forgot password |
| 🏠 **Home Screen** | Browse by category (Hotels, Resorts, Restaurants, Cafes) |
| 📍 **Nearby Places** | GPS-based nearby recommendations |
| 🔍 **Search & Filters** | Full text search with advanced filters (price, rating, availability, amenities, distance) |
| 📋 **Place Details** | Rich detail view with photos, amenities, map, and contact info |
| 📞 **Call Button** | One-tap phone calling |
| 🗺️ **Google Maps Directions** | Get driving directions to any place |
| ❤️ **Favorites** | Save and manage favorite places |
| 👤 **User Profile** | Edit name, phone, view favorites count |
| ⚡ **Real-time Data** | Live Firestore updates via snapshot listeners |
| 📱 **Responsive UI** | Clean, modern design with loading and empty states |
| 🎨 **Splash Screen** | Animated branded splash screen |

---

## 🏗️ Tech Stack

- **Framework:** React Native + Expo (TypeScript)
- **Auth:** Firebase Authentication (Email/Password)
- **Database:** Cloud Firestore (real-time)
- **Storage:** Firebase Storage
- **Maps:** react-native-maps (Google Maps)
- **Location:** Expo Location
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **State:** React Context API

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Firebase project with Firestore, Auth, and Storage enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/harshitchaudhary892-hash/GoReserve.git
cd GoReserve

# Install dependencies
npm install

# Start Expo dev server
npx expo start
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`go-reserve-73fec`)
3. Enable **Authentication** → Email/Password sign-in method
4. Enable **Cloud Firestore**
5. Enable **Firebase Storage**
6. Update `src/config/firebase.ts` with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### Firestore Schema

Create a `places` collection with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Place name |
| `category` | string | One of: Hotel, Resort, Restaurant, Cafe |
| `address` | string | Street address |
| `city` | string | City name |
| `state` | string | State name |
| `latitude` | number | GPS latitude |
| `longitude` | number | GPS longitude |
| `phone` | string | Contact phone number |
| `description` | string | Place description |
| `rating` | number | Rating (0-5) |
| `priceRange` | string | One of: $, $$, $$$, $$$$ |
| `imageUrl` | string | Image URL (Firebase Storage or any CDN) |
| `amenities` | array | List of amenities (WiFi, Parking, Pool, etc.) |
| `availability` | string | One of: Open, Closed, Busy |

### Build for Production

```bash
# Android APK
npx eas build --platform android --profile production

# iOS IPA
npx eas build --platform ios --profile production

# Play Store / App Store
npx eas submit --platform android
npx eas submit --platform ios
```

---

## 📂 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI: Button, Input, LoadingScreen, badges
│   └── place/           # PlaceCard, CategoryBar
├── config/              # Firebase config, theme, constants
├── contexts/            # AuthContext, AppStateContext
├── hooks/               # useLocation, useRealtimePlaces, useSearchHistory
├── navigation/          # RootNavigator, AuthNavigator, MainNavigator
├── screens/
│   ├── Auth/            # Login, Signup, ForgotPassword
│   ├── Home/            # Home screen with categories & nearby places
│   ├── Search/          # Search with filters & sort
│   ├── Details/         # Place details with map & actions
│   ├── Favorites/       # Saved places
│   ├── Profile/         # User profile
│   └── Splash/          # Animated splash screen
├── services/            # Firestore CRUD: places, user
├── types/               # TypeScript interfaces
└── utils/               # Helper functions
```

---

## 📝 License

MIT © 2026 Go Reserve
