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


const router = express.Router();

// Register a company
router.post('/register',upload.single('image'),registerCompany);

// Login a company
router.post('/login', loginCompany);

// Get company data
router.get('/company', getCompanyData);

// Post a new job
router.post('/post-job', postJob);

// Get company job applicants 
router.get('/applicants', getCompanyJobApplicants);

// Get company posted jobs
router.get('/list-jobs', getCompanyPostedJobs);

// Change job application status
router.post('/change-status', changeJobApplicationStatus);

// Change applicants visibility
router.post('/change-visibility', changeVisibility);

export default router;