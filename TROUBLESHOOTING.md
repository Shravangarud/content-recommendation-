# 🔧 Troubleshooting Guide - SmartContent

Common issues and their solutions.

---

## 🚨 Installation Issues

### Issue: `npm install` fails
**Symptoms:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solutions:**
1. Check Node.js version: `node --version` (need v16+)
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and `package-lock.json`, retry
4. Run as administrator/sudo if permission errors

---

### Issue: Python packages won't install
**Symptoms:**
```
ERROR: Could not find a version that satisfies the requirement
```

**Solutions:**
1. Check Python version: `python --version` (need 3.8+)
2. Upgrade pip: `python -m pip install --upgrade pip`
3. Use virtual environment:
   ```bash
   cd ml-api
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

---

## 💾 Database Issues

### Issue: MongoDB connection refused
**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
MongoServerError: Authentication failed
```

**Solutions:**

**1. MongoDB not running:**
```bash
# Windows - Start MongoDB service
net start MongoDB

# Or run manually
mongod

# Linux/Mac
sudo systemctl start mongod
# Or
brew services start mongodb-community
```

**2. Wrong connection string:**
Check `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/smartcontent
```

**3. Port conflict:**
Check if MongoDB is on different port:
```bash
netstat -an | findstr 27017
```

**4. Authentication issues:**
If authentication enabled:
```env
MONGODB_URI=mongodb://username:password@localhost:27017/smartcontent
```

---

### Issue: Database seed fails
**Symptoms:**
```
Error: User validation failed
```

**Solutions:**
1. Drop existing database:
   ```bash
   mongo
   use smartcontent
   db.dropDatabase()
   exit
   ```
2. Run seed again: `node backend/seed.js`

---

## 🌐 Server Issues

### Issue: Port already in use
**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

**Alternative:** Change port in `.env`:
```env
PORT=5001
```

---

### Issue: Backend server crashes immediately
**Symptoms:**
Server starts then crashes with no error

**Solutions:**
1. Check `.env` file exists and is configured
2. Verify MongoDB is running
3. Check for syntax errors in server.js
4. Run with error logging:
   ```bash
   node backend/server.js 2>&1 | tee error.log
   ```

---

### Issue: ML API not responding
**Symptoms:**
```
Error: Failed to connect to ML API
```

**Solutions:**
1. Check Python dependencies installed:
   ```bash
   pip list | grep Flask
   ```
2. Verify ML API running:
   ```bash
   curl http://localhost:5001/health
   ```
3. Check `ML_API_URL` in backend `.env`:
   ```env
   ML_API_URL=http://localhost:5001
   ```
4. Check Python version (need 3.8+)
5. Look for Python errors in terminal

---

## 🎨 Frontend Issues

### Issue: Frontend can't connect to backend
**Symptoms:**
```
Failed to fetch
Network request failed
```

**Solutions:**

**1. Check API URL in config.js:**
```javascript
const CONFIG = {
    API_URL: 'http://localhost:5000/api',  // Must match backend
    // ...
};
```

**2. CORS error - Update backend:**
```javascript
// backend/server.js
app.use(cors({
    origin: '*',  // Or specify frontend URL
    credentials: true
}));
```

**3. Backend not running:**
- Check backend terminal for errors
- Verify: `curl http://localhost:5000/health`

---

### Issue: Login not working
**Symptoms:**
- Login button does nothing
- "Invalid credentials" despite correct password
- Token not saving

**Solutions:**

**1. Check browser console for errors**

**2. Clear localStorage:**
```javascript
// In browser console
localStorage.clear();
```

**3. Check JWT_SECRET is set:**
```env
JWT_SECRET=your_secret_key_here
```

**4. Verify user exists:**
```bash
node backend/seed.js  # Recreate test users
```

**5. Check password in database:**
Test users from seed:
- admin@smartcontent.com / admin123
- user@example.com / user123

---

### Issue: Recommendations not loading
**Symptoms:**
- Loading spinner forever
- Empty recommendation section
- Console errors

**Solutions:**

**1. Check ML API is running:**
```bash
curl http://localhost:5001/health
```

**2. Check user has interactions:**
- Like some content first
- View content
- Rate items

**3. Fallback to popular content:**
System should auto-fallback if ML fails

**4. Check ML API URL:**
```env
# backend/.env
ML_API_URL=http://localhost:5001
```

---

## 🔐 Authentication Issues

### Issue: JWT token expired
**Symptoms:**
```
401 Unauthorized
Token is not valid
```

**Solutions:**
1. Logout and login again
2. Clear localStorage: `localStorage.clear()`
3. Token expires in 7 days (configurable in `routes/auth.js`)

---

### Issue: Can't access admin panel
**Symptoms:**
"Access denied. Admin only."

**Solutions:**
1. Login with admin account:
   - Email: admin@smartcontent.com
   - Password: admin123

2. Check user role in database:
   ```javascript
   // In MongoDB shell
   db.users.find({ email: "admin@smartcontent.com" })
   ```

3. Manually set admin role:
   ```javascript
   db.users.updateOne(
     { email: "your@email.com" },
     { $set: { role: "admin" } }
   )
   ```

---

## 📊 Data Issues

### Issue: No content showing
**Symptoms:**
- Explore page empty
- No recommendations

**Solutions:**
1. Seed database:
   ```bash
   node backend/seed.js
   ```

2. Check content in database:
   ```javascript
   // MongoDB shell
   use smartcontent
   db.contents.count()
   db.contents.find().limit(5)
   ```

3. Check isActive flag:
   ```javascript
   // Update all content to active
   db.contents.updateMany({}, { $set: { isActive: true } })
   ```

---

### Issue: Search returns no results
**Symptoms:**
Search box works but finds nothing

**Solutions:**
1. Create text index:
   ```javascript
   // MongoDB shell
   db.contents.createIndex({
     title: "text",
     description: "text",
     tags: "text"
   })
   ```

2. Check search query format
3. Try exact title match first

---

## 🎯 ML/Recommendation Issues

### Issue: Same recommendations always
**Symptoms:**
Recommendations don't change

**Solutions:**
1. Interact with different content types
2. Update preferences in profile
3. Clear recommendation cache (restart backend)
4. Check ML API logs for errors

---

### Issue: ML API returns errors
**Symptoms:**
```
500 Internal Server Error from ML API
```

**Solutions:**
1. Check Python dependencies:
   ```bash
   pip install -r ml-api/requirements.txt
   ```

2. Check scikit-learn version:
   ```bash
   pip show scikit-learn
   ```

3. Look for Python errors in terminal
4. Test with minimal data:
   ```bash
   curl -X POST http://localhost:5001/health
   ```

---

## 🚀 Deployment Issues

### Issue: Render deployment fails
**Symptoms:**
Build fails, deployment error

**Solutions:**
1. Check build logs in Render dashboard
2. Verify package.json scripts:
   ```json
   {
     "scripts": {
       "start": "node backend/server.js"
     }
   }
   ```

3. Check environment variables are set
4. Ensure all dependencies in package.json
5. Check Node.js version in Render settings

---

### Issue: MongoDB Atlas connection fails
**Symptoms:**
```
MongoServerError: bad auth
```

**Solutions:**
1. Check connection string format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```

2. URL-encode password if special characters:
   ```javascript
   // If password is "p@ss#word"
   // Use: p%40ss%23word
   ```

3. Check IP whitelist in MongoDB Atlas
4. Verify database user permissions

---

### Issue: CORS errors in production
**Symptoms:**
```
Access-Control-Allow-Origin blocked
```

**Solutions:**
Update backend CORS:
```javascript
// backend/server.js
const cors = require('cors');
app.use(cors({
    origin: [
        'https://your-frontend.vercel.app',
        'http://localhost:5500'
    ],
    credentials: true
}));
```

---

## 🔍 Debugging Tips

### Enable Debug Logging

**Backend:**
```javascript
// backend/server.js
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
```

**Frontend:**
```javascript
// frontend/js/api.js
async function apiRequest(endpoint, options = {}) {
    console.log('API Request:', endpoint, options);
    // ... rest of code
}
```

### Check API Health

```bash
# Backend
curl http://localhost:5000/health

# ML API
curl http://localhost:5001/health

# Get content
curl http://localhost:5000/api/content
```

### Browser DevTools

1. **Console Tab**: Check for JavaScript errors
2. **Network Tab**: Monitor API requests/responses
3. **Application Tab**: Check localStorage values
4. **Elements Tab**: Inspect DOM structure

### MongoDB Commands

```javascript
// Connect to database
use smartcontent

// Count documents
db.users.count()
db.contents.count()
db.interactions.count()

// View data
db.users.find().pretty()
db.contents.find().limit(3).pretty()

// Check indexes
db.contents.getIndexes()

// Clear collections
db.interactions.deleteMany({})
```

---

## 📱 Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Known Issues
- ❌ Internet Explorer (not supported)
- ⚠️ Safari < 14 (async/await issues)

---

## 🆘 Still Having Issues?

1. **Check Error Messages**: Read them carefully
2. **Console Logs**: Always check browser console
3. **Server Logs**: Check backend terminal output
4. **Clear Cache**: Browser cache and localStorage
5. **Restart Everything**: Stop all servers, restart
6. **Fresh Install**: Delete node_modules, reinstall

### Fresh Start Procedure

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear database
mongo
use smartcontent
db.dropDatabase()
exit

# 3. Clean install
rm -rf node_modules package-lock.json
npm install
cd ml-api
rm -rf venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..

# 4. Reconfigure
cp .env.example .env
# Edit .env

# 5. Seed database
node backend/seed.js

# 6. Restart servers
npm start  # Terminal 1
npm run ml-server  # Terminal 2
# Open frontend in browser
```

---

## 📞 Getting Help

If issues persist:

1. Check documentation files:
   - README.md
   - QUICKSTART.md
   - API_DOCUMENTATION.md

2. Review code comments in source files

3. Search error messages online

4. Check package versions compatibility

---

**Most issues are resolved by:**
- ✅ Verifying all servers are running
- ✅ Checking environment variables
- ✅ Clearing cache/localStorage
- ✅ Reseeding database
- ✅ Fresh npm/pip install

**Good luck! 🍀**
