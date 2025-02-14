import { createContext, useCallback, useEffect, useState } from "react";

import { toast } from "react-toastify";

import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";


export const Appcontext = createContext();

export const AppcontextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const {user}=useUser()
  const {getToken}=useAuth()
  const [searchFilter, setSearchFilter] = useState({
    title: '',
    location: ''
  });

  const [isSearched, setIsSearched] = useState(false)

  const  [jobs,setJobs]=useState([])

  const [showRecruiterLogin,setShowRecruiterLogin]=useState(false)

  const [companyToken,setCompanyToken]=useState(null)
  const [companyData,setCompanyData]=useState(null)

  const [userData,setUserData]=useState(null)
  const [userApplications,setUserApplications]=useState([])

  //function to fetch jobs

  const fetchJobs =async()=>{
    try {
      const {data} =await axios.get(backendUrl+'/api/jobs')

      if (data.success) {
        setJobs(data.jobs)
        console.log(data.jobs)
        
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
     
  }

  // function to fetch company data
  const fetchCompanyData = useCallback (async ()=>{
    try {
      const {data} = await axios.get(backendUrl+'/api/company/company',{headers:{token:companyToken},
      });

      if(data.success){
        setCompanyData(data.company)
        console.log("Company Data",data.company)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  },[companyToken,backendUrl])

// function to fetch userdata
  const fetchUserData=async ()=>{
    try {
      const token= await getToken();

      const {data}= await axios.get(backendUrl+'/api/users/user',
        {headers:{Authorization:`Bearer ${token}`}})

        if (data.success) {
          setUserData(data.user)
        }else{
          toast.error(data.message)
        }
    } catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(()=>{
    fetchJobs()

    const storedCompanyToken = localStorage.getItem('companyToken')

    if(storedCompanyToken){
      setCompanyToken(storedCompanyToken)
    }
  },[]);

  useEffect(()=>{
      if(companyToken){
       fetchCompanyData();
       

      }
  },[companyToken,fetchCompanyData])

  useEffect(()=>{
      if (user) {
        fetchUserData()
      }
  },[user])

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl


  };

  return (
    <Appcontext.Provider value={value}>
      {props.children}
    </Appcontext.Provider>
  );
};
