# ⚡ Quick Start Guide - SmartContent

Get SmartContent running in 5 minutes!

## 🎯 Prerequisites Check

```bash
# Check Node.js (need v16+)
node --version

# Check MongoDB (need v5+)
mongod --version

# Check Python (need v3.8+)
python --version
```

## 🚀 Installation Steps

### 1. Install Dependencies (2 minutes)

```bash
# Navigate to project
cd "content recomendation system"

# Install Node.js packages
npm install

# Install Python packages
cd ml-api
pip install -r requirements.txt
cd ..
```

### 2. Setup Environment (1 minute)

**Create `.env` in root directory:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartcontent
JWT_SECRET=my_super_secret_key_12345
ML_API_URL=http://localhost:5001
NODE_ENV=development
```

### 3. Start MongoDB (30 seconds)

```bash
# Windows
mongod

# Or if installed as service
net start MongoDB
```

### 4. Seed Database (30 seconds)

```bash
node backend/seed.js
```

**Test accounts created:**
- Admin: `admin@smartcontent.com` / `admin123`
- User: `user@example.com` / `user123`

### 5. Start Servers (1 minute)

**Open 3 terminals:**

**Terminal 1 - Backend:**
```bash
npm start
```
✅ Server running on http://localhost:5000

**Terminal 2 - ML API:**
```bash
cd ml-api
python app.py
```
✅ ML API running on http://localhost:5001

**Terminal 3 - Frontend:**
```bash
# Install Live Server extension in VS Code
# Right-click on frontend/index.html → "Open with Live Server"
# Or use any local web server
```
✅ Frontend running on http://localhost:5500

---

## 🎮 Using the Application

### First Time User Flow:

1. **Visit Homepage**
   - http://localhost:5500 (or your Live Server port)

2. **Sign Up**
   - Click "Get Started" or "Login"
   - Switch to "Sign Up" tab
   - Create account

3. **Set Preferences**
   - Go to Profile
   - Select favorite categories
   - Add interest tags
   - Save preferences

4. **Explore Content**
   - Browse all content in Explore page
   - Use search and filters
   - Like, view, and rate content

5. **Get Recommendations**
   - Return to Home
   - View personalized recommendations
   - Based on your interactions!

### Admin Flow:

1. **Login as Admin**
   - Email: `admin@smartcontent.com`
   - Password: `admin123`

2. **Access Admin Panel**
   - Click "Admin" in navigation

3. **Manage Content**
   - Add new content
   - Edit existing content
   - Delete content

4. **View Analytics**
   - Click "Analytics"
   - See user stats, trending items
   - Most viewed/liked content

---

## 🧪 Testing ML Recommendations

### Test the Recommendation Engine:

1. **Login with test user**
   ```
   Email: user@example.com
   Password: user123
   ```

2. **Interact with content:**
   - Like 3-5 articles about Technology
   - View some videos
   - Rate a few items

3. **Check recommendations:**
   - Go to Home page
   - See personalized feed
   - Content similar to what you liked!

4. **Test collaborative filtering:**
   - Create another user account
   - Like similar content
   - Both users get similar recommendations

---

## 📊 API Testing

### Test Backend API:

```bash
# Health check
curl http://localhost:5000/health

# Get all content
curl http://localhost:5000/api/content

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}'
```

### Test ML API:

```bash
# Health check
curl http://localhost:5001/health
```

---

## 🐛 Common Issues & Fixes

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix:** Start MongoDB
```bash
mongod
```

### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Fix:** Change port in `.env` or kill process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill
```

### Issue: Python Module Not Found
```
ModuleNotFoundError: No module named 'flask'
```
**Fix:** Install dependencies:
```bash
cd ml-api
pip install -r requirements.txt
```

### Issue: CORS Error in Browser
```
Access to fetch blocked by CORS policy
```
**Fix:** Check backend CORS settings in `backend/server.js`

### Issue: Frontend can't connect to backend
**Fix:** Update `frontend/js/config.js`:
```javascript
const CONFIG = {
    API_URL: 'http://localhost:5000/api',  // Check port
    ML_API_URL: 'http://localhost:5001',
    TOKEN_KEY: 'smartcontent_token',
    USER_KEY: 'smartcontent_user'
};
```

---

## 🎯 Feature Checklist

Test these features:

- [ ] User signup/login
- [ ] User profile update
- [ ] Set preferences (categories, tags)
- [ ] Browse all content
- [ ] Search content
- [ ] Filter by type/category
- [ ] Like content
- [ ] Rate content
- [ ] View content (tracks view count)
- [ ] Personalized recommendations
- [ ] Similar content recommendations
- [ ] Trending content
- [ ] Admin: Add content
- [ ] Admin: Edit content
- [ ] Admin: Delete content
- [ ] Analytics: Overview stats
- [ ] Analytics: Most viewed
- [ ] Analytics: Most liked
- [ ] Analytics: Top rated

---

## 🚀 Next Steps

1. **Customize Content:**
   - Edit `backend/seed.js`
   - Add your own content
   - Re-run: `node backend/seed.js`

2. **Improve ML Model:**
   - Add more training data
   - Tune recommendation parameters
   - Implement additional features

3. **Deploy to Production:**
   - Follow `DEPLOYMENT.md`
   - Use MongoDB Atlas
   - Deploy to Render/Vercel

4. **Enhance UI:**
   - Customize `frontend/css/style.css`
   - Add more animations
   - Improve mobile responsiveness

---

## 📝 Useful Commands

```bash
# Start backend in dev mode (auto-reload)
npm run dev

# Start ML API
npm run ml-server

# Seed database
node backend/seed.js

# Check logs
# Terminal shows real-time logs

# Reset database
# Drop database in MongoDB Compass or:
mongo
use smartcontent
db.dropDatabase()
exit
node backend/seed.js
```

---

## 🎊 You're All Set!

SmartContent is now running locally. Enjoy building and testing!

**Need help?** Check:
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide
- Code comments in source files

**Happy coding! 🚀**
