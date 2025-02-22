import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import  User  from "../models/User.js"
import { v2 as cloudinary} from "cloudinary"


export const createUser = async (req, res) => {
    try {
        const { clerkUserId, name, email } = req.body;

        // Check if user already exists
        let user = await User.findOne({ clerkUserId });

        if (!user) {
            user = new User({
                clerkUserId,
                name,
                email,
                resume: "",
                image: ""
            });
            await user.save();
        }

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
};
// get userdata


export const getUserData = async (req,res) => {
    try {
    const userId= req.auth.userId

  
        const user = await User.findOne({clerkUserId:userId})

        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        res.json({
            success:true,
            user
        })
    } catch (error) {
        res.json({success:false,message:error.message})
    }


}

// apply for job
export const applyForJob = async (req,res) => {

    const {jobId} = req.body;

    const userId= req.auth.userId;

    try {
        const isAlreadyApplied = await JobApplication.find({jobId,userId});

        if(isAlreadyApplied.length>0){
            return res.json({success:false,message:"Already applied "})
        }

        const jobData= await Job.findById(jobId);

        if(!jobData){
            return res.json({success:false,message:"Job not found"})
        }

        await JobApplication.create({
            companyId:jobData.companyId,
            userId,
            jobId,
            date:Date.now()
        })

        res.json({success:true,message:"Applied successfully"})

    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

// get user applied application
export const getUserJobApplications = async (req,res) => {

    try {
        const userId= req.auth.userId;

        const applications = await JobApplication.find({userId})
        .populate('companyId','name email image',)
        .populate('jobId','title description location salary level category ')
        .exec();

        if(!applications){
            return res.json({success:false,message:"No applications found"})
            
        }

        return res.json({success:true,applications})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// update user profile
export const updateUserResume= async (req,res) => {
        try {
            const userId = req.auth.userId;

            const resumeFile=req.resumeFile

            const userData=await User.findOne({clerkUserId:userId});
            if (!userData) {
                return res.json({ success: false, message: "User not found" });
            }


            
            if(resumeFile){
                const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
                    userData.resume=resumeUpload.secure_url;
                
            }

            await userData.save();

            return res.json({success:true,message:"Resume updated successfully"})

        } catch (error) {
            res.json({success:false,message:error.message})
        }
}


export const createUserIfNotExists = async (req, res) => {
    try {
        const {clerkUserId,email,name,resume,Image}=req.body;

    let user = await User.findOne({ clerkUserId });
    if (!user) {
        user = new User({ clerkUserId, email, name, resume,Image });
        await user.save();
      }
  
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

