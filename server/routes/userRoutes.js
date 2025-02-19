import express from 'express';
import { 
  applyForJob, 
  getUserData, 
  getUserJobApplications, 
  updateUserResume 
} from '../controllers/userController.js';
import upload from '../config/multer.js';

const router = express.Router();

// get user data
router.get('/user', getUserData);

// apply for job
router.post('/apply', applyForJob);

// get applied job data
router.get('/applications', getUserJobApplications);

// update user profile (resume)
router.post('/update-resume', upload.single('resume'), updateUserResume);

// Create user endpoint
router.post('/create', async (req, res) => {
  try {
    const { clerkUserId, email } = req.body;
    
    // Your logic to create a user (e.g., inserting into the database)
    // For demonstration, we're just returning a success message.
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: { clerkUserId, email }
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
