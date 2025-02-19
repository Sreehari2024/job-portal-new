import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

export const Appcontext = createContext();

export const AppcontextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { user } = useUser();
  const { getToken } = useAuth();

  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(
    localStorage.getItem("companyToken") || null
  );
  const [companyData, setCompanyData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  // 1. Fetch all jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setJobs(data.jobs);
        console.log("Jobs fetched:", data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 2. Fetch company data (if companyToken exists)
  const fetchCompanyData = useCallback(async () => {
    if (!companyToken) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        setCompanyData(data.company);
        console.log("Company Data:", data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [companyToken, backendUrl]);

  // 3. **Fetch user data** from your backend using Clerk's token
  const fetchUserData = useCallback(async () => {
    if (!user) return; // no user from Clerk yet
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }
      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.user);
        console.log("User Data:", data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(
        error.response?.data?.message || "Error fetching user data"
      );
    }
  }, [user, getToken, backendUrl]);

  // 4. Call `fetchUserData` once Clerk’s user is available
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  // 5. Fetch all jobs on mount
  useEffect(() => {
    fetchJobs();
    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }
  }, []);

  // 6. Fetch company data if we have a company token
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken, fetchCompanyData]);

  // 7. Create a user in your backend if Clerk’s user does not exist
  useEffect(() => {
    const createUserIfNotExists = async () => {
      if (!user?.id) return;
      try {
        const token = await getToken();
        if (!token) return;
        await axios.post(
          `${backendUrl}/api/users/create`,
          {
            clerkUserId: user.id,
            email: user.primaryEmailAddress.emailAddress,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("User creation response:",resizeBy.data);
        if (res.data.success) {
          fetchUserData();
        }
        
      } catch (error) {
        console.error("User creation error:", error);
      }
    };
    createUserIfNotExists();
  }, [user, getToken, backendUrl]);

  // 8. Provide context values to child components
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
    backendUrl,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
  };

  return (
    <Appcontext.Provider value={value}>
      {props.children}
    </Appcontext.Provider>
  );
};
