import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhook } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send("API working"));
app.get("/debug-sentry", (req, res) => {
    throw new Error("My first Sentry error!");
});

app.post('/webhooks', clerkWebhook);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// Function to start the server
const startServer = async () => {
    try {
        await connectDB();
        await connectCloudinary();

        const PORT = process.env.PORT || 5000;
        Sentry.setupExpressErrorHandler(app);

        app.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup error:", error);
        process.exit(1); // Exit process with failure
    }
};

// Start the server
startServer();
