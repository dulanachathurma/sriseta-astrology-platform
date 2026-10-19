# Sri Seta Astrology Platform (ශ්‍රී සෙත ජ්‍යොතිෂ සේවය)

> An advanced, full-stack, AI-driven astrology and consultation web platform that modernizes traditional Sri Lankan astrological services. It combines Generative AI, cloud database persistence, automated web scraping, and a luxury glassmorphic design to provide personalized horoscope insights in authentic Sinhala.

---

## 🌟 Project Overview

**Sri Seta Astrology Platform** is a complete digital solution tailored for traditional astrological consultations (led by senior astrologer Shriani Samaraweera). The platform bridges centuries-old Vedic and Sri Lankan astrological methods with cutting-edge software engineering. 

Users can register, log in to an isolated personal account, enter their birth details (Birth Date, Janma Lagna, Navamshaka, and 9 planetary house positions), and receive an instant, in-depth astrological analysis generated via **Google Gemini AI**. All user data and generated reports are stored securely in **MongoDB Atlas** with user-level isolation. In addition, the platform automatically scrapes and displays live weekly national horoscopes, provides an interactive consultation booking workflow, and offers direct WhatsApp consultation linking.

---

## 🎯 Key Features & Capabilities

* **🤖 Personalized AI Horoscope Engine (Google Gemini AI)**:
  - Generates deep, authentic Sinhala astrological readings based on traditional Sri Lankan planetary rules and Bhava positions.
  - Covers key life domains: Higher Education (අධ්‍යාපනය), Marriage & Relationships (විවාහය), Career & Profession (රැකියාව), Wealth & Property (දේපළ), Children (දරුපල), and Foreign Travel (විදේශගතවීම).
  - Built-in traditional astrological fallback engine ensuring 100% uptime even during external API downtime.

* **🔐 Secure Authentication & Multi-User Isolation**:
  - JWT (JSON Web Token) authentication architecture with `bcryptjs` password hashing.
  - Private user profiles where each user's horoscope charts and reports are strictly separated and stored in **MongoDB Atlas**.
  - One-click clear feature allowing users to safely reset their form inputs, cached readings, and cloud records.

* **📰 Automated Real-Time Web Scraping**:
  - Serverless scraper built with **Axios** and **Cheerio** that extracts the latest weekly horoscopes directly from *Divaina Nakatha*.
  - In-memory edge caching with fallback preservation, eliminating manual administrative maintenance.

* **🎨 Luxury Glassmorphic UI/UX**:
  - Bespoke dark-gold celestial theme with smooth Framer Motion micro-interactions, responsive mobile-first navigation, and tailored Sinhala typography.
  - Interactive modals for authentication, chart entry, and consultation requests.

* **📱 Consultation & Service Booking Integration**:
  - Integrated Service Booking modal connecting users directly to Astrologer Shriani Samaraweera.
  - Automated WhatsApp message generation formatted with the user's birth chart parameters for personalized inquiries.

---

## 🛠️ Technology Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, Vite |
| **Styling & Design System** | Tailwind CSS, Custom Glassmorphism, Sinhala Fonts |
| **Animations & Icons** | Framer Motion, Lucide React |
| **Routing** | React Router v7 |
| **Backend & Microservices** | Node.js Serverless Functions (Vercel Edge / Node runtime) |
| **Database** | MongoDB Atlas (Cloud NoSQL), Mongoose ODM |
| **Artificial Intelligence** | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| **Authentication & Security** | JWT (JSON Web Tokens), `bcryptjs` (Salt & Hash) |
| **Web Scraping & HTTP** | Axios, Cheerio |
| **Hosting & Deployment** | Vercel Serverless Platform |

---

## 📸 Screenshots

<img width="1422" height="794" alt="Hero & Astrology Showcase" src="https://github.com/user-attachments/assets/e0f0db6c-e883-4b9b-95b5-f78b9e5c4028" />

<img width="1422" height="750" alt="Personalized AI Horoscope Modal" src="https://github.com/user-attachments/assets/3f11a4dd-7a99-4384-ab24-7bcb159b7f68" />

<img width="1414" height="760" alt="Services & Consultation Details" src="https://github.com/user-attachments/assets/3f45a074-bab3-488a-b06e-a96ee63b8c77" />

<img width="1422" height="794" alt="Weekly Horoscope Live Feed" src="https://github.com/user-attachments/assets/38375849-3cd5-4234-8dd2-20b70414aa06" />

---

## 👥 Registered Users (Testing & Evaluation)

For demonstration, evaluation, and grading purposes, you can use the following pre-registered user accounts:

| Name (නම) | Email (ඊමේල්) | Password (මුරපදය) | Access Level |
| :--- | :--- | :--- | :--- |
| **Dulana** | `dulanachathurma99@gmail.com` | `123456` | Registered Member |
| **Samaraweera** | `s@gmail.com` | `123456` | Registered Member |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dulanachathurma/sriseta-astrology-platform.git
   cd sriseta-astrology-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
├── api/                           # Vercel Serverless Functions
│   ├── auth/                      # Authentication endpoints (login, register)
│   ├── horoscope/                 # AI Horoscope generator handler
│   ├── user/                      # User profile & horoscope storage endpoints
│   ├── models/                    # Mongoose database models (User.js)
│   ├── lib/                       # MongoDB connection & user store helpers
│   └── weekly-horoscope.js        # Live web scraper for Divaina Nakatha
├── public/                        # Static assets, branding & images
├── src/
│   ├── components/                # Modular UI components (HoroscopeModal, ServiceForm, etc.)
│   ├── context/                   # Global state providers (AuthContext.jsx)
│   ├── pages/                     # Route-level views (Home.jsx)
│   ├── utils/                     # Site configuration and helpers
│   ├── App.jsx                    # Root layout and routing
│   └── main.jsx                   # Application entry point
├── apiDevPlugin.js                # Vite local dev plugin to emulate serverless routes
├── vercel.json                    # Vercel deployment configuration
└── README.md                      # Project documentation
```

---

## 🌐 Deployment

The project is configured for continuous zero-config deployment on **Vercel**:
1. Connect your GitHub repository to Vercel.
2. In the Vercel Project Settings, add the required Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
3. Trigger a deployment. Both static frontend assets and serverless functions deploy automatically.

---

## 📄 License & Attribution

© 2026 **ශ්‍රී සෙත ජ්‍යොතිෂ සේවය (Sri Seta Astrology Service)**. All Rights Reserved.
Developed with ❤️ by [Dulana Chathurma](https://github.com/dulanachathurma).
