import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const Appcontext = createContext();

export const AppcontextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({
    title: '',
    location: ''
  });

  const [isSearched, setIsSearched] = useState(false)

  const  [jobs,setJobs]=useState([])

  const [showRecruiterLogin,setShowRecruiterLogin]=useState(false)

  //function to fetch jobs

  const fetchJobs =async()=>{
      setJobs(jobsData)
  }

  useEffect(()=>{
    fetchJobs()
  },[]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin

  };

  return (
    <Appcontext.Provider value={value}>
      {props.children}
    </Appcontext.Provider>
  );
};
