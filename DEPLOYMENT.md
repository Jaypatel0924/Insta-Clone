# Deployment Guide

This guide covers deploying the Instagram Clone application to production environments.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment](#post-deployment)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No console errors or warnings
- [ ] Linting passes (`npm run lint`)
- [ ] No hardcoded credentials in code
- [ ] All environment variables documented

### Security
- [ ] Enable HTTPS/SSL certificates
- [ ] Update SECRET_KEY with strong random value
- [ ] Set secure cookie flags
- [ ] Enable CORS only for your domain
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] SQL/NoSQL injection prevention verified

### Performance
- [ ] Images optimized (Cloudinary)
- [ ] Lazy loading implemented
- [ ] Database indexes created
- [ ] Caching strategy defined
- [ ] CDN configured (optional)

### Documentation
- [ ] API documentation complete
- [ ] Setup instructions updated
- [ ] Deployment documented
- [ ] Emergency procedures documented

---

## Backend Deployment

### Option 1: Deploy to Heroku (Recommended for Beginners)

#### Prerequisites
```bash
npm install -g heroku-cli
heroku login
```

#### Step 1: Create Heroku App
```bash
cd backend
heroku create your-app-name
```

#### Step 2: Set Environment Variables
```bash
heroku config:set MONGO_DB_URI=your_mongodb_uri
heroku config:set SECRET_KEY=your_secret_key
heroku config:set PORT=5000
heroku config:set CLOUDINARY_NAME=your_cloudinary_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
heroku config:set SOCKET_IO_CORS_ORIGIN=https://your-frontend-url.com
```

#### Step 3: Create Procfile
```bash
# In backend/ directory, create file: Procfile
web: node index.js
```

#### Step 4: Deploy
```bash
git push heroku main
heroku logs --tail
```

#### Step 5: Verify Deployment
```bash
heroku open
curl https://your-app-name.herokuapp.com/api/v1/user/logout
```

---

### Option 2: Deploy to Render

#### Step 1: Connect GitHub Repository
1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select repository

#### Step 2: Configure Service
```
Name: instaclone-backend
Environment: Node
Build Command: npm install
Start Command: npm run dev
Region: Your closest region
```

#### Step 3: Add Environment Variables
```
MONGO_DB_URI: your_mongodb_uri
SECRET_KEY: your_secret_key
PORT: 10000
CLOUDINARY_NAME: your_cloudinary_name
CLOUDINARY_API_KEY: your_api_key
CLOUDINARY_API_SECRET: your_api_secret
NODE_ENV: production
```

#### Step 4: Deploy
Click "Deploy" and wait for completion.

---

### Option 3: Deploy to Railway

#### Step 1: Connect GitHub
1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository

#### Step 2: Add MongoDB Service
1. Click "Add" → "Database" → "MongoDB"
2. Railway creates MongoDB URI automatically

#### Step 3: Configure Backend Service
```
MONGO_DB_URI: ${{Mongo.MONGO_URL}}
SECRET_KEY: [generate new key]
CLOUDINARY_NAME: your_cloudinary_name
CLOUDINARY_API_KEY: your_api_key
CLOUDINARY_API_SECRET: your_api_secret
NODE_ENV: production
```

#### Step 4: Deploy
Commit and push to GitHub, Railway auto-deploys.

---

### Option 4: Deploy to AWS EC2

#### Step 1: Launch EC2 Instance
```bash
# Instance type: t3.micro (free tier eligible)
# OS: Ubuntu 22.04 LTS
# Security group: Allow ports 22, 80, 443, 3000
```

#### Step 2: Connect and Setup
```bash
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Install Git
sudo apt-get install -y git
```

#### Step 3: Clone and Setup
```bash
git clone your-repo-url
cd your-repo/backend
npm install
```

#### Step 4: Configure Environment
```bash
nano .env
```

Add your environment variables.

#### Step 5: Install PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start index.js --name "instaclone-backend"
pm2 startup
pm2 save
```

#### Step 6: Setup Nginx (Reverse Proxy)
```bash
sudo apt-get install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo systemctl restart nginx
```

#### Step 7: Setup SSL with Certbot
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Frontend Deployment

### Option 1: Deploy to Vercel

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
cd frontend
vercel
```

#### Step 3: Configure Environment Variables
In Vercel Dashboard:
```
VITE_BACKEND_API=https://your-backend-url
VITE_SOCKET_IO_URL=https://your-backend-url
```

#### Step 4: Update vite.config.js
```javascript
export default {
  define: {
    'process.env.VITE_BACKEND_API': JSON.stringify(process.env.VITE_BACKEND_API),
    'process.env.VITE_SOCKET_IO_URL': JSON.stringify(process.env.VITE_SOCKET_IO_URL)
  }
}
```

---

### Option 2: Deploy to Netlify

#### Step 1: Connect GitHub
1. Go to [Netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect GitHub and select repo

#### Step 2: Configure Build Settings
```
Build command: npm run build
Publish directory: dist
```

#### Step 3: Add Environment Variables
```
VITE_BACKEND_API: https://your-backend-url
VITE_SOCKET_IO_URL: https://your-backend-url
```

#### Step 4: Deploy
Click "Deploy site"

---

### Option 3: Deploy to AWS S3 + CloudFront

#### Step 1: Build Frontend
```bash
cd frontend
npm run build
```

#### Step 2: Create S3 Bucket
```bash
aws s3 mb s3://your-bucket-name --region us-east-1
```

#### Step 3: Upload Files
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

#### Step 4: Setup CloudFront
1. Go to CloudFront Console
2. Create distribution pointing to S3
3. Configure SSL certificate
4. Update DNS CNAME

#### Step 5: Configure Environment
Update `.env` with CloudFront URL.

---

### Option 4: Manual Server Deployment

#### Step 1: Build Application
```bash
cd frontend
npm run build
```

#### Step 2: Upload Build Files
```bash
scp -r dist/* ubuntu@your-server:/var/www/instaclone
```

#### Step 3: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/instaclone
```

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /var/www/instaclone;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://your-backend-url;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Database Setup

### MongoDB Atlas (Recommended)

#### Step 1: Create Account
Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

#### Step 2: Create Cluster
1. Click "Build a Database"
2. Select "M0 Shared" (free tier)
3. Choose cloud provider and region
4. Click "Create"

#### Step 3: Configure Security
1. Go to "Database Access"
2. Create username and password
3. Go to "Network Access"
4. Add your IP or allow all (0.0.0.0/0) for development

#### Step 4: Get Connection String
1. Click "Connect"
2. Choose "Connect Your Application"
3. Copy connection string
4. Replace `<username>`, `<password>` with your credentials

#### Step 5: Add to Environment
```
MONGO_DB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

---

### Self-Hosted MongoDB

#### Step 1: Install MongoDB
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Step 2: Create Database and User
```bash
mongosh

# Switch to admin
use admin

# Create user
db.createUser({
  user: "instaclone",
  pwd: "strongpassword123",
  roles: [{ role: "readWrite", db: "instaclone" }]
})

# Switch to app database
use instaclone

# Create collections
db.createCollection("users")
db.createCollection("posts")
```

#### Step 3: Configure Security
```bash
# Enable authentication
sudo nano /etc/mongod.conf
```

Add:
```yaml
security:
  authorization: enabled
```

---

## Environment Configuration

### Backend .env (Production)
```env
PORT=5000
MONGO_DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/instaclone
SECRET_KEY=your-long-random-secret-key-min-32-chars
NODE_ENV=production

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CORS_ORIGIN=https://your-frontend-url.com
SOCKET_IO_CORS_ORIGIN=https://your-frontend-url.com

JWT_EXPIRE=7d
COOKIE_EXPIRE=7
```

### Frontend Environment (.env.production)
```env
VITE_BACKEND_API=https://your-backend-api.com/api/v1
VITE_SOCKET_IO_URL=https://your-backend-api.com
```

---

## Post-Deployment

### Verify Deployment

#### Backend
```bash
curl https://your-backend-url/api/v1/user/logout
```

Expected response:
```json
{
  "message": "Logged out successfully.",
  "success": true
}
```

#### Frontend
```bash
curl https://your-frontend-url
```

Should return HTML content.

### Database Verification
```bash
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/instaclone"

use instaclone
db.users.count()
```

### SSL Certificate Verification
```bash
openssl s_client -connect your-domain.com:443
```

---

## Monitoring

### Backend Monitoring

#### With PM2
```bash
pm2 logs instaclone-backend
pm2 monit
pm2 show instaclone-backend
```

#### With Heroku
```bash
heroku logs -t
heroku metrics
```

#### With Render
Dashboard → Logs section

### Frontend Monitoring
- Vercel: Dashboard → Analytics
- Netlify: Analytics section
- AWS CloudWatch: CloudFront metrics

### Database Monitoring

#### MongoDB Atlas
1. Go to Monitoring section
2. Check Metrics (CPU, Memory, Disk)
3. Review Op Performance
4. Check Query Logs

#### Self-Hosted
```bash
# Connect to MongoDB
mongosh

# Check stats
db.stats()

# Check collections
db.getCollectionNames()

# Check indexes
db.users.getIndexes()
```

### Application Health Checks

#### Backend Health Endpoint
Add to `backend/index.js`:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  })
})
```

#### Monitor with Uptime Robot
1. Go to [UptimeRobot](https://uptimerobot.com)
2. Create monitor for `https://your-backend/health`
3. Set check interval (every 5 minutes)
4. Get notifications if down

---

## Troubleshooting

### Backend Not Starting

#### Check Logs
```bash
# Heroku
heroku logs --tail

# PM2
pm2 logs

# Docker
docker logs container_name
```

#### Common Issues
```bash
# Port already in use
lsof -i :5000
kill -9 <PID>

# MongoDB connection failed
# Check MONGO_DB_URI in .env
# Verify whitelist IP in MongoDB Atlas

# Out of memory
pm2 start index.js --max-memory-restart 500M
```

### Frontend Not Loading

#### Check Console
Open browser DevTools → Console tab

#### Common Issues
- CORS errors: Check `CORS_ORIGIN` in backend .env
- API endpoint wrong: Verify `VITE_BACKEND_API`
- Socket.io connection failed: Verify `VITE_SOCKET_IO_URL`

#### Clear Cache
```bash
# Browser cache
Ctrl+Shift+Delete (Windows)
Cmd+Shift+Delete (Mac)

# Build cache
npm run build -- --force
```

### Database Connection Issues

```bash
# Test MongoDB connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/instaclone"

# Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.posts.createIndex({ author: 1 })
db.stories.createIndex({ author: 1, expiresAt: 1 })
```

### Performance Issues

#### Slow API Response
```javascript
// Add timing middleware
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    console.log(`${req.method} ${req.path} - ${Date.now() - start}ms`)
  })
  next()
})
```

#### High Memory Usage
```bash
# Identify leaks with clinic.js
npm install -g clinic
clinic doctor -- node index.js
```

#### Database Slow Queries
```javascript
// Add slow query logging
db.setProfilingLevel(1, { slowms: 100 })
```

---

## Backup Strategy

### MongoDB Backup

#### Automated with MongoDB Atlas
1. Go to Backup & Restore
2. Enable Automatic Backup
3. Set retention policy (30 days)
4. Test restore monthly

#### Manual Backup
```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/instaclone" \
          --out=./backup
```

#### Restore from Backup
```bash
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/instaclone" \
             ./backup
```

### Code Backup
```bash
# GitHub (recommended)
git push origin main

# Automated with GitHub Actions
# Create .github/workflows/backup.yml
name: Backup
on: [push]
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: echo "Backup completed"
```

---

## Rollback Procedure

### If Deployment Fails

#### Heroku
```bash
heroku releases
heroku rollback
```

#### Vercel/Netlify
Dashboard → Deployments → Click previous version → "Redeploy"

#### GitHub
```bash
git revert HEAD
git push origin main
```

---

## Cost Estimation (Monthly)

| Service | Free/Paid | Estimated Cost |
|---------|-----------|-----------------|
| MongoDB Atlas | Free (512MB) | $0-50 |
| Cloudinary | Free (25GB) | $0-30 |
| Heroku Backend | Paid | $7-50 |
| Vercel Frontend | Free | $0 |
| Domain | Paid | $10-15 |
| SSL Certificate | Free (Let's Encrypt) | $0 |
| **Total** | | **$17-145** |

---

## Maintenance Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Database backup | Daily | DevOps |
| Security updates | Weekly | DevOps |
| Performance check | Weekly | DevOps |
| Code review | Per PR | Team Lead |
| User feedback review | Monthly | Product |
| Cost optimization | Monthly | DevOps |

---

**Last Updated:** November 2024
**Version:** 1.0.0
