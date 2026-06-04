# 🍳 CookBook Pro

A modern recipe web application built with **React** and powered by **Firebase** — discover, save, and manage your favorite recipes in one place.

🔗 **Live Demo:** [cook-book-pink.vercel.app](https://cookbook-666.web.app)

---

## ✨ Features

- 🔐 **User Authentication** — Sign up and log in securely via Firebase Auth
- 📖 **Browse Recipes** — Explore a collection of curated recipes
- 🔍 **Search** — Quickly find recipes by name or ingredient
- 💾 **Save Favorites** — Bookmark recipes to your personal collection
- ☁️ **Cloud Storage** — Data persisted with Firestore in real time
- ⚡ **Serverless Functions** — Backend logic handled by Firebase Cloud Functions
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App) |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Backend | Firebase Cloud Functions |
| Hosting | Firebase Hosting / Vercel |
| Styling | CSS |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm
- A Firebase project ([Create one here](https://console.firebase.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prathmesh-space/CookBook.git
   cd CookBook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**

   Create a `.env` file in the root directory and add your Firebase config:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Runs the app in development mode |
| `npm test` | Launches the test runner in interactive watch mode |
| `npm run build` | Builds the app for production into the `build/` folder |
| `npm run eject` | Ejects CRA configuration (irreversible) |

---

## 🗂️ Project Structure

```
CookBook/
├── public/             # Static assets
├── src/                # React source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components
│   └── ...
├── functions/          # Firebase Cloud Functions
├── dataconnect/        # Firebase Data Connect config
├── firestore.rules     # Firestore security rules
├── firestore.indexes.json
├── firebase.json       # Firebase project configuration
└── package.json
```

---

## 🔥 Firebase Setup

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login and initialize:
   ```bash
   firebase login
   firebase init
   ```

3. Deploy:
   ```bash
   firebase deploy
   ```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with ❤️ by [prathmesh-space](https://github.com/prathmesh-space)
