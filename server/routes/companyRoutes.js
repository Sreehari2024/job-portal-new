import express from 'express';
import upload from '../config/multer.js';
import { 
    registerCompany, 
    loginCompany, 
    getCompanyData, 
    postJob, 
    getCompanyJobApplicants, 
    getCompanyPostedJobs, 
    changeJobApplicationStatus, 
    changeVisibility 
} from '../controllers/companyController.js';
import { protectCompany } from '../middlewares/authMiddleware.js';


const router = express.Router();

// Register a company
router.post('/register',upload.single('image'),registerCompany);

// Login a company
router.post('/login', loginCompany);

// Get company data
router.get('/company', protectCompany, getCompanyData);

// Post a new job
router.post('/post-job', protectCompany, postJob);

// Get company job applicants 
router.get('/applicants', protectCompany, getCompanyJobApplicants);

// Get company posted jobs
router.get('/list-jobs', protectCompany, getCompanyPostedJobs);

// Change job application status
router.post('/change-status', protectCompany, changeJobApplicationStatus);

// Change applicants visibility
router.post('/change-visibility', protectCompany, changeVisibility);

export default router;