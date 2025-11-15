# bmwCMS_Backend

A clean and scalable **CMS Backend** built with **Node.js**, **Express**, and **TypeScript**.  
This backend provides a modular foundation for managing BMW CMS content with controllers, models, routes, and middleware.

---

## 🚀 Features

- Built using **TypeScript**
- Organized MVC-style folder structure
- RESTful API ready
- Authentication & middleware support
- Easy to extend for CMS modules
- Environment-based configuration

---

## 📁 Project Structure

```
.
├─ config/         # Database + application configuration
├─ controllers/    # All controller logic
├─ middleware/     # Auth, error handlers, validators
├─ model/          # Database models / schemas
├─ routes/         # API route definitions
├─ types/          # TypeScript interfaces and global types
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB / SQL** (configure via env)
- **JWT Authentication** (if enabled)
- Modern ES Module setup

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/rajansharma001/bmwCMS_Backend.git
cd bmwCMS_Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/bmwcms
JWT_SECRET=your_jwt_secret
```

(Add extra variables if your config needs them)

---

## ▶️ Running the Project

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

---

## 📜 Example Scripts (Update based on your package.json)

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint . --ext .ts"
  }
}
```

---

## 🔌 API Overview (Example)

### Auth Routes

- `POST /auth/login`

### Routes

- `GET /pages`
- `POST /pages`
- `PUT /pages/:id`
- `DELETE /pages/:id`

---
