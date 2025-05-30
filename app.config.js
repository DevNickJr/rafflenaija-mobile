module.exports = ({ config }) => {
  return {
    ...config,
    "name": "rafflenaija",
    "slug": "rafflenaija",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/adaptive-icon2.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.devnickjr.rafflenaija",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon2.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.devnickjr.rafflenaija"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon2.png",
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "image": "./assets/images/splash-icon2.png",
            "backgroundColor": "#ffffff"
          },
          "imageWidth": 200,

        }
      ],
      [
        "expo-secure-store",
        {
          "configureAndroidBackup": true,
          "faceIDPermission": "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      publicPaymentKey: process.env.EXPO_PUBLIC_PAYMENT_KEY,
      apiPrefix: process.env.EXPO_PUBLIC_API_ENDPOINT,
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "4dbb14fe-821c-4f47-b3e1-7ed624daf173"
      }
    }
  };
};