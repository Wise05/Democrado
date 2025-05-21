import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error('MONGO_URI not set in .env file');
}

mongoose.connect(mongoURI)
	.then(() => {
		consol.log("MongoDB connected");
	})
	.catch(err => {
		console.error("MongoDB error:", err);
	});

// Routes
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

