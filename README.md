# ✨ MagicPages

> **Turn your child into a cartoon hero — then let them color it!**

MagicPages is an AI-powered coloring book generator for kids. Parents upload a photo of their child, pick a cartoon world template (Naruto, Dragon Ball, Doraemon, and more), and the app generates a **black & white line art coloring page** featuring the child inside that cartoon universe. The child then prints and colors it themselves.

---

## 📸 How It Works

```
Child's Photo  +  Cartoon Template  =  Coloring Page (black & white line art)
```

1. **Upload** — Parent uploads a reference photo of their child
2. **Pick a World** — Choose from cartoon world templates (each with a unique AI prompt)
3. **Generate** — Google Gemini AI transforms the photo into line art inside that cartoon world
4. **Download & Color** — Child prints the page and colors it with crayons or markers

---

## 🛠️ Tech Stack

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Google Gemini AI (`gemini-2.5-flash-image`) | AI image generation |
| Cloudinary | Image hosting (reference + generated images) |
| JWT (`jsonwebtoken`) | Authentication |
| bcryptjs | Password hashing |
| Multer | File upload handling |
| dotenv | Environment config |

### Frontend *(planned)*
| Tool | Purpose |
|------|---------|
| React | UI library |
| Tailwind CSS | Styling |
| React Router DOM | Client-side routing |

---

## 📁 Project Structure

```
MagicPages/
├── server/
│   ├── config/
│   │   └── dbconfig.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Register, login, JWT
│   │   ├── userControllers.js   # Upload, profile, credits, templates
│   │   ├── imageGenController.js# Gemini AI generation pipeline
│   │   └── adminControllers.js  # User mgmt, credit approvals, templates
│   ├── middlewares/
│   │   ├── authMiddlewares.js       # JWT protect (forUser / forAdmin)
│   │   ├── creditUpdateMiddlewares.js # Check & deduct credits
│   │   ├── imageUploadMiddlewares.js  # Multer config
│   │   ├── cloudinaryMiddlewares.js   # Cloudinary upload helper
│   │   └── errorHandler.js           # Global error handler
│   ├── models/
│   │   ├── userModel.js          # User schema
│   │   ├── referenceImageModel.js# Uploaded child photos
│   │   ├── genImageModel.js      # AI generated coloring pages
│   │   ├── templateModel.js      # Cartoon world templates
│   │   └── creditRequestModel.js # Credit top-up requests
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── imageGenRoutes.js
│   │   └── adminRoutes.js
│   └── server.js                 # Entry point
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Create new account |
| POST | `/login` | Public | Login, returns JWT |

### User — `/api/user`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload` | 🔒 User | Upload a reference photo |
| GET | `/images` | 🔒 User | Get all uploaded reference photos |
| GET | `/templates` | 🔒 User | Get all available cartoon templates |
| POST | `/request_credits` | 🔒 User | Submit a credit top-up request |
| GET | `/profile` | 🔒 User | Full profile: user info + images + generated pages + credit requests |

### Image Generation — `/api/image`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/generate` | 🔒 User + 💳 Credits | Generate coloring page from photo + template |

### Admin — `/api/admin`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | 👑 Admin | List all users |
| PUT | `/users/:uid` | 👑 Admin | Update user (credits, isAdmin, etc.) |
| GET | `/credit_requests` | 👑 Admin | View all credit requests |
| PUT | `/credit_requests/:rid` | 👑 Admin | Approve or deny a credit request |
| POST | `/template` | 👑 Admin | Create a new cartoon world template |

> 🔒 Requires `Authorization: Bearer <token>` header
> 👑 Requires `isAdmin: true` on the user account
> 💳 Deducts credits from user balance before generation

---

## ⭐ Credit System

- Every new user starts with **5 free credits**
- Each image generation costs credits based on the template's `creditExpense` value
- Users can request more credits via the app
- Admins review and approve/deny credit requests manually
- When a request is approved, credits are instantly added to the user's balance

---

## 🤖 AI Generation Pipeline

```
1. User sends imageURL (Cloudinary) + templateId
2. Credit middleware checks balance → deducts credits → passes to controller
3. Controller fetches the reference image → converts to base64
4. Sends base64 image + template prompt to Gemini (gemini-2.5-flash-image)
   with config: responseModalities: ["IMAGE", "TEXT"]
5. Gemini returns inline base64 image data
6. Server saves image to temp disk → uploads to Cloudinary → deletes temp file
7. Stores Cloudinary URL in GenImage model linked to user
8. Returns the final coloring page URL
```

The **template prompt** is the creative core — it tells Gemini exactly what cartoon world style, characters, and line-art coloring-book format to use.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/saif8839/MagicPages.git
cd MagicPages

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

### Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm run server
```

Server runs at `http://localhost:5000`

---

## 🗃️ Data Models

### User
```js
{
  name: String,
  email: String (unique),
  phone: Number (unique),
  password: String (hashed),
  isAdmin: Boolean (default: false),
  isActive: Boolean,
  credits: Number (default: 5),
  timestamps: true
}
```

### ImageTemplate
```js
{
  title: String,
  imageURL: String,     // preview image on Cloudinary
  prompt: String,       // AI generation prompt
  isActive: Boolean,
  creditExpense: Number,
  timestamps: true
}
```

### ReferenceImage
```js
{
  user: ObjectId (ref: User),
  imageURL: String,     // Cloudinary URL
  timestamps: true
}
```

### GenImage
```js
{
  user: ObjectId (ref: User),
  imageURL: String,     // Generated coloring page on Cloudinary
  timestamps: true
}
```

### CreditRequest
```js
{
  user: ObjectId (ref: User),
  credits: Number,
  isApproved: Boolean,
  timestamps: true
}
```

---

## 🧪 Example Template Prompt

Here's an example of what a template's `prompt` field looks like for the Naruto world:

```
Transform the child in this photo into a coloring book page set in the 
Naruto universe. Draw the child in Naruto manga style wearing a ninja 
headband and outfit, surrounded by characters like Naruto, Sasuke, and 
Sakura with the Hidden Leaf Village in the background. 
Use clean black outlines only, no color fills, white background. 
Line art suitable for children to color with crayons.
```

---

## 🐛 Known Issues

- `creditsExpense` field name mismatch between `createTemplate` controller (`creditsRequired` from body) and the model (`creditExpense`) — needs alignment
- `isActive` on User model has a typo: `deefault: false` instead of `default: false`

---

## 🗺️ Roadmap

- [ ] Frontend (React + Tailwind)
- [ ] PDF export of coloring pages
- [ ] More cartoon world templates
- [ ] Admin dashboard analytics
- [ ] Email notifications for credit approvals
- [ ] Social sharing of generated pages

---

## 📄 License

ISC

---

<div align="center">
  Made with ✨ for kids who love to color
</div>