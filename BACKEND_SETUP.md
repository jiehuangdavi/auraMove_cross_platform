# Backend Setup Guide for AuraMove

## Prerequisites
- Node.js installed on your computer
- MongoDB Atlas account (or local MongoDB)
- The backend folder should be in your project root

## Step 1: Backend Environment Setup

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a .env file in the backend folder with:**
   ```
   MONGO_URI=mongodb+srv://jiehuang239:Pb5bQPRHeERLkkYr@auramove.itlpksr.mongodb.net/
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5001
   ```

## Step 2: Find Your Local IP Address

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" - it will be something like `192.168.1.100`

**On Mac/Linux:**
```bash
ifconfig
```
Look for "inet" followed by your local IP address

## Step 3: Update Frontend Configuration

1. **Open `src/app/auth/config.js`**
2. **Replace the IP address in `BASE_URL` with your computer's IP:**
   ```javascript
   BASE_URL: 'http://YOUR_IP_ADDRESS:5001',
   ```

## Step 4: Start the Backend

1. **In the backend folder, run:**
   ```bash
   npm start
   ```

2. **You should see:**
   ```
   Server started on port 5001
   MongoDB Connected...
   ```

## Step 5: Test the Connection

1. **Start your React Native app**
2. **Try to register a new account**
3. **Check the backend console for database operations**

## Troubleshooting

### "Network Error" or "No response from server"
- Make sure your computer and phone are on the same WiFi network
- Verify the IP address in `config.js` is correct
- Check if your firewall is blocking port 5001

### "MongoDB Connected..." not showing
- Verify your MongoDB connection string in `.env`
- Check if your IP is whitelisted in MongoDB Atlas

### JWT errors
- Make sure `JWT_SECRET` is set in your `.env` file
- The secret should be a long, random string

## API Endpoints

- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User login  
- **GET** `/api/auth` - Get user profile (protected)

## Data Structure

The backend expects these fields for registration:
- `email` (string, required)
- `password` (string, required, min 6 chars)
- `age` (number, required, 1-120)
- `gender` (string, required: 'male', 'female', 'other', 'prefer_not_to_say')
- `goal` (string, required: 'muscle_gain', 'losing_weight', 'become_muscular', 'maintain_fitness', 'improve_endurance', 'other')
