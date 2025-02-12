import Company from '../models/Company.js';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import generateToken from '../utils/generateToken.js';

// Register a new company
export const registerCompany = async (req, res) => {

}

// company login
export const loginCompany = async (req,res) => {

    const {name,email,password} = req.body

    const imageFile = req.file;

    if(!name||!email||!password||!imageFile){
        return res.json({succes:false,message: "Mising details"})
    }

    try {
        const companyExists = await Company.findOne({email});

        if(companyExists){
            return res.json({success:false,message: "Company already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const imageUpload= await cloudinary.uploader.upload(imageFile.path);

        const company=await Company.create({
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success:true,
            company:{
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token:generateToken(company._id)

        })

    } catch (error) {
        res.json({success:false,message: error.message})    
        
    }

}
// Get company data
export const getCompanyData = async (req,res) => {

}
// post new job
export const postJob = async (req,res) => {

}
// get company jobs applicants
export const getCompanyJobApplicants = async (req,res) => {

}
// get company  posted jobs
export const getCompanyPostedJobs = async (req,res) => {

}
// Change job application status
export const changeJobApplicationStatus = async (req,res) => {

}
// change job visibility
export const changeVisibility = async (req,res) => {

}