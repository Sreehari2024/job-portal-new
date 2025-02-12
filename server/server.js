import './config/instrument.js'
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhook } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';



// initialize express

const app = express();

// connect to database

await connectDB()
await connectCloudinary()

// middleware

app.use(cors());
app.use(express.json());

// routes
app.get('/', (req, res) =>res.send("API working"))
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
  

  app.post('/webhooks',clerkWebhook)
  app.use('/api/company',companyRoutes)

// port
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () =>{
     console.log(`Server running on port ${PORT}`)
    });


