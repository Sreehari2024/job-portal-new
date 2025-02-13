import React, { useContext } from 'react'
import { Route,Routes } from 'react-router-dom'
import Applications from './pages/Applications'
import Home from './pages/Home'
import Applyjob from './pages/Applyjob'
import RecruiterLogin from './components/RecruiterLogin'
import { Appcontext } from './context/Appcontext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const {showRecruiterLogin} =useContext(Appcontext);
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin/>}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="apply-job/:id" element={<Applyjob/>}/>
        <Route path="/applications" element={<Applications/>}/>
       <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={<AddJob />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
        </Route>
        </Routes>
    </div>
  )
}

export default App