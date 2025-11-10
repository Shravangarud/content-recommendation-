# 🚀 Deployment Guide for SmartContent

This guide covers deploying SmartContent to production using free/low-cost hosting services.

## 📋 Deployment Architecture

```
Frontend (Vercel/Netlify)
    ↓
Backend API (Render/Railway)
    ↓
MongoDB Atlas (Cloud Database)
    ↓
ML API (Render/Railway)
```

---

## 1️⃣ Database - MongoDB Atlas (Free Tier)

### Setup MongoDB Atlas

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to your users
   - Name your cluster (e.g., "smartcontent-cluster")

3. **Setup Database Access**
   - Database Access → Add New Database User
   - Username: `smartcontent_user`
   - Password: Generate secure password (save it!)
   - Database User Privileges: Read and write to any database

4. **Setup Network Access**
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string:
   ```
   mongodb+srv://smartcontent_user:<password>@cluster0.xxxxx.mongodb.net/smartcontent?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

---

## 2️⃣ Backend API - Render.com (Free Tier)

### Deploy Backend to Render

1. **Prepare Repository**
   ```bash
   # Create .gitignore if not exists
   echo "node_modules
   .env
   *.log" > .gitignore
   
   # Initialize git and push to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to [Render.com](https://render.com)
   - Sign up (can use GitHub)

3. **Create New Web Service**
   - Dashboard → New → Web Service
   - Connect your GitHub repository
   - Configure:
     - **Name**: `smartcontent-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node backend/server.js`
     - **Plan**: Free

4. **Add Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-random-secret-key>
   ML_API_URL=<will-add-after-ml-api-deployment>
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL: `https://smartcontent-backend.onrender.com`

---

## 3️⃣ ML API - Render.com (Free Tier)

### Deploy ML API to Render

1. **Create Python Web Service**
   - Dashboard → New → Web Service
   - Same repository
   - Configure:
     - **Name**: `smartcontent-ml-api`
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r ml-api/requirements.txt`
     - **Start Command**: `python ml-api/app.py`
     - **Plan**: Free

2. **Add Environment Variables**
   ```
   PORT=5001
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Copy ML API URL: `https://smartcontent-ml-api.onrender.com`

4. **Update Backend Environment**
   - Go back to backend service on Render
   - Update `ML_API_URL` to ML API URL
   - Redeploy backend

---

## 4️⃣ Frontend - Vercel (Free Tier)

### Deploy Frontend to Vercel

1. **Update Frontend Configuration**
   
   Edit `frontend/js/config.js`:
   ```javascript
   const CONFIG = {
       API_URL: 'https://smartcontent-backend.onrender.com/api',
       ML_API_URL: 'https://smartcontent-ml-api.onrender.com',
       TOKEN_KEY: 'smartcontent_token',
       USER_KEY: 'smartcontent_user'
   };
   ```

2. **Create vercel.json** (in root directory)
   ```json
   {
     "buildCommand": "echo 'No build needed'",
     "outputDirectory": "frontend",
     "routes": [
       { "src": "/.*", "dest": "/" }
     ]
   }
   ```

3. **Deploy to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`
   - Deploy: `vercel --prod`
   - OR use Vercel Dashboard:
     - Go to [Vercel.com](https://vercel.com)
     - Import GitHub repository
     - Set root directory to `frontend`
     - Deploy

4. **Alternative: Netlify**
   
   Create `netlify.toml`:
   ```toml
   [build]
     publish = "frontend"
     command = "echo 'No build needed'"
   ```
   
   - Drag and drop `frontend` folder to [Netlify Drop](https://app.netlify.com/drop)
   - OR connect GitHub repository

---

## 5️⃣ Post-Deployment Configuration

### Update CORS Settings

Edit `backend/server.js`:
```javascript
const cors = require('cors');

app.use(cors({
    origin: [
        'https://your-frontend-url.vercel.app',
        'http://localhost:3000' // for local testing
    ],
    credentials: true
}));
```

### Seed Production Database

```bash
# Update .env with production MongoDB URI
MONGODB_URI=<production-mongodb-atlas-uri>

# Run seed script
node backend/seed.js
```

---

## 6️⃣ Custom Domain (Optional)

### Vercel Custom Domain
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Render Custom Domain
1. Render Dashboard → Your Service → Settings → Custom Domains
2. Add your domain
3. Update DNS records

---

## 🔧 Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartcontent
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
ML_API_URL=https://smartcontent-ml-api.onrender.com
NODE_ENV=production
```

### ML API (.env)
```env
PORT=5001
```

### Frontend (config.js)
```javascript
API_URL: 'https://smartcontent-backend.onrender.com/api'
ML_API_URL: 'https://smartcontent-ml-api.onrender.com'
```

---

## 📊 Monitoring & Maintenance

### Check Service Health
- Backend: `https://your-backend-url.onrender.com/health`
- ML API: `https://your-ml-api-url.onrender.com/health`

### Render Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- 750 hours/month free

### Solutions for Cold Starts
1. **Use Cron Job Service** (UptimeRobot, Cron-job.org)
   - Ping your API every 10 minutes to keep it warm
   
2. **Upgrade to Paid Plan** ($7/month)
   - No cold starts
   - Always running

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```javascript
// Check connection string format
mongodb+srv://username:password@cluster.mongodb.net/dbname

// Ensure password is URL-encoded if it contains special characters
```

### CORS Errors
- Add frontend URL to backend CORS configuration
- Check browser console for specific error

### ML API Timeout
- Increase timeout on backend:
```javascript
axios.defaults.timeout = 30000; // 30 seconds
```

### Deployment Fails
- Check build logs on Render dashboard
- Verify all dependencies in package.json
- Check Node.js version compatibility

---

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created and accessible
- [ ] Backend deployed to Render
- [ ] ML API deployed to Render
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Database seeded with sample data
- [ ] All services health checks passing
- [ ] Test login works
- [ ] Recommendations load correctly
- [ ] Admin panel accessible

---

## 📱 Quick Deploy Commands

```bash
# Backend/ML API (Render - Auto-deploy from Git)
git add .
git commit -m "Update"
git push origin main

# Frontend (Vercel)
vercel --prod

# Or use GitHub integration for auto-deploy
```

---

## 💡 Cost Optimization

**Free Tier Options:**
- MongoDB Atlas: 512MB storage
- Render: 750 hours/month per service
- Vercel: Unlimited deployments
- Total: **$0/month**

**Recommended Paid:**
- Render: $7/month (no cold starts)
- MongoDB Atlas: $9/month (2GB storage)
- Total: **~$16/month** for production-ready setup

---

**Deployment complete! 🎊 Your SmartContent app is now live!**
