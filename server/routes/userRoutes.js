import express from 'express';
import { 
  applyForJob, 
  getUserData, 
  getUserJobApplications, 
  updateUserResume,
  createUserIfNotExists,
  createUser 
} from '../controllers/userController.js';
import upload from '../config/multer.js';


const router = express.Router();
router.post("/not-exist",createUserIfNotExists)

router.post("/create",createUser)

// get user data
router.get('/user', getUserData);

// apply for job
router.post('/apply', applyForJob);

// get applied job data
router.get('/applications', getUserJobApplications);

// update user profile (resume)
router.post('/update-resume', upload.single('resume'), updateUserResume);

// Create user endpoint
router.post('/create/webhook', async (req, res) => {
  try {
    const { id, email,name,resume,Image } = req.body.data;
    
    // Your logic to create a user (e.g., inserting into the database)
    // For demonstration, we're just returning a success message.
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: { clerkUserId, email,name,resume,Image }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

export default router;
