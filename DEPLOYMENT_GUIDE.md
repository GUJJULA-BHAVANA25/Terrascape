# Deployment Guide for Terrascape

## Quick Local Access

Your project is currently running locally. To access it:

1. **Frontend (Landing Page):**
   - Open browser: `http://localhost:3000/Main-Page.html`
   - Or: `http://localhost:3000/` (if index.html is set up)

2. **API Endpoints:**
   - Health Check: `http://localhost:3000/api/health`
   - All APIs: `http://localhost:3000/api/*`

3. **Signup/Signin Pages:**
   - Signup: `http://localhost:3000/User-Signup/user-signup.html`
   - Signin: `http://localhost:3000/User-Signin/User-Signin.html`

---

## Deploy to Production (Make it Live Online)

### Option 1: Render.com (Recommended - Free Tier)

**Backend Deployment:**

1. **Create account** at [render.com](https://render.com)

2. **Create a new Web Service:**
   - Connect your GitHub repository
   - Build Command: `cd Backend && npm install`
   - Start Command: `cd Backend && node index.js`
   - Environment Variables:
     ```
     MONGO_URL=your_mongodb_atlas_connection_string
     JWT_SECRET=your_secret_key
     NODE_ENV=production
     ```

3. **Static Site for Frontend:**
   - Create a new Static Site
   - Connect your repository
   - Build Command: `npm install` (if needed)
   - Publish Directory: `Frontend`

**MongoDB Setup:**
- Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- Create a cluster
- Get connection string
- Add to Render environment variables

---

### Option 2: Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. In project root: `vercel`
3. Follow prompts

**Backend on Railway:**
1. Sign up at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy

---

### Option 3: Heroku (Full Stack)

1. **Install Heroku CLI:**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create App:**
   ```bash
   heroku create your-app-name
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set MONGO_URL=your_mongodb_url
   heroku config:set JWT_SECRET=your_secret
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Update package.json:**
   ```json
   "scripts": {
     "start": "cd Backend && node index.js"
   }
   ```

---

### Option 4: Netlify (Frontend) + Backend Anywhere

**Frontend:**
1. Sign up at [netlify.com](https://netlify.com)
2. Drag & drop `Frontend` folder
3. Or connect GitHub repo

**Backend:**
- Deploy to Render, Railway, or Heroku
- Update frontend API URLs to point to backend URL

---

## Update Frontend for Production

After deploying backend, update API URLs in frontend files:

**Files to update:**
- `Frontend/main-page.js`
- `Frontend/User-Signup/user-signup.js`
- `Frontend/User-Signin/user-signin.js`

**Change:**
```javascript
// From:
const API_BASE_URL = 'http://localhost:3000/api';

// To:
const API_BASE_URL = 'https://your-backend-url.com/api';
```

---

## Quick Setup for Local Network Access

To access from other devices on your network:

1. **Find your local IP:**
   ```bash
   ipconfig  # Windows
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Update server to listen on all interfaces:**
   In `Backend/index.js`, change:
   ```javascript
   app.listen(3000, '0.0.0.0', () => {
     // This allows access from network
   });
   ```

3. **Access from other devices:**
   - `http://192.168.1.100:3000/Main-Page.html`

---

## Recommended: Render.com Setup (Step-by-Step)

### Step 1: Prepare MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all)
5. Get connection string

### Step 2: Deploy Backend to Render
1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. New → Web Service
4. Connect GitHub repo
5. Settings:
   - **Name:** terrascape-backend
   - **Environment:** Node
   - **Build Command:** `cd Backend && npm install`
   - **Start Command:** `cd Backend && node index.js`
   - **Environment Variables:**
     - `MONGO_URL`: (from Atlas)
     - `JWT_SECRET`: (generate random string)
6. Deploy

### Step 3: Deploy Frontend to Render
1. New → Static Site
2. Connect GitHub repo
3. Settings:
   - **Build Command:** (leave empty or `echo "No build needed"`)
   - **Publish Directory:** `Frontend`
4. Update frontend API URLs to backend URL
5. Deploy

---

## Testing Your Deployment

1. **Backend Health Check:**
   ```
   https://your-backend.onrender.com/api/health
   ```

2. **Test API:**
   ```bash
   curl https://your-backend.onrender.com/api/packages
   ```

3. **Frontend:**
   ```
   https://your-frontend.onrender.com
   ```

---

## Environment Variables Template

Create `.env` file in `Backend/` folder:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/terrascape?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
NODE_ENV=production
```

**Important:** Never commit `.env` to Git! Add to `.gitignore`

---

## Troubleshooting

### CORS Issues
If frontend can't connect to backend:
- Add frontend URL to CORS in `Backend/index.js`:
  ```javascript
  app.use(cors({
    origin: ['http://localhost:3000', 'https://your-frontend-url.com']
  }));
  ```

### MongoDB Connection Issues
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Check network access in Atlas

### Port Issues
- Render/Railway provide `PORT` environment variable
- Update `Backend/index.js`:
  ```javascript
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  ```

---

## Quick Start Commands

**Local Development:**
```bash
cd Backend
node index.js
```

**Production Build:**
```bash
npm install --production
cd Backend
node index.js
```

---

Need help? Check the main README.md for API documentation.

