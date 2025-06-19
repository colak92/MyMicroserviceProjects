import { Avatar, Button } from '@mui/material'
import { useState } from 'react'
import "./Sidebar.css"
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../ReduxToolkit/AuthSlice'
import CreateCompany from '../Company/CreateCompany'
import CreateJob from '../Job/CreateJob'
import JobList from '../Job/JobList'
import { useSelector } from 'react-redux';
import ApplicantList from '../Applicant/ApplicantList'
import CompleteApplicantProfile from '../Applicant/CompleteApplicantProfile'
import JobApplicationList from '../JobApplication/JobApplicationList'

const menu=[
  {name:"Home", value:"HOME", role:["ROLE_ADMIN","ROLE_APPLICANT"]},
  {name:"Assigned", value:"ASSIGNED", role:["ROLE_ADMIN"]},
  {name:"New Applicant", value:"", role:["ROLE_APPLICANT"]},
  {name:"Applicant List", value:"", role:["ROLE_ADMIN","ROLE_APPLICANT"]},
  {name:"Job List", value:"", role:["ROLE_ADMIN"]},
  {name:"New Company", value:"", role:["ROLE_ADMIN","ROLE_COMPANY"]},
  {name:"New Job", value:"", role:["ROLE_ADMIN"]},
  {name:"Job Application List", value:"", role:["ROLE_ADMIN","ROLE_COMPANY"]},
]

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const role = user?.role || "";

    const [activeMenu,setActiveMenu]=useState("Home");

    // open Job list
    const [openListOfJobs, setOpenListOfJobs]=useState(false);
    const handleCloseListOfJobs = () =>{
      setOpenListOfJobs(false);
    };
    const handleOpenListOfJobs = () => {
      setOpenListOfJobs(true);
    };

    // open Applicant profile
    const [openApplicantProfile, setOpenApplicantProfile]=useState(false);
    const onCloseApplicantProfile = () =>{
      setOpenApplicantProfile(false);
    };
    const handleOpenApplicantProfile = () => {
      setOpenApplicantProfile(true);
    };

    // open Applicant list
    const [openListOfApplicants, setOpenListOfApplicants]=useState(false);
    const handleCloseListOfApplicants = () =>{
      setOpenListOfApplicants(false);
    };
    const handleOpenListOfApplicants = () => {
      setOpenListOfApplicants(true);
    };

    // open Create Company
    const [openCreateCompany,setOpenCreateCompany]=useState(false);
    const handleCloseCreateCompany = () =>{
      setOpenCreateCompany(false);
    };
    const handleOpenCreateCompany = () => {
      setOpenCreateCompany(true);
    };

    // open Create Job
    const [openCreateJob,setOpenCreateJob]=useState(false);
    const handleCloseCreateJob = () =>{
      setOpenCreateJob(false);
    };
    const handleOpenCreateJob = () => {
      setOpenCreateJob(true);
    };

    // open Job Application List
    const [openJobApplicationList,setOpenJobApplicationList]=useState(false);
    const handleCloseJobApplicationList = () =>{
      setOpenJobApplicationList(false);
    };
    const handleOpenJobApplicationList = () => {
      setOpenJobApplicationList(true);
    };

    const handleMenuChange = (item) => {

      console.log("Current user role:", role);
      const updatedParams = new URLSearchParams(location.search);

      if (item.name === "New Applicant") {
        handleOpenApplicantProfile();
      }

      if (item.name === "Applicant List") {
        handleOpenListOfApplicants();
      }

      else if (item.name === "Job List") {
        handleOpenListOfJobs();
      }

      else if (item.name === "New Company") {
        handleOpenCreateCompany();
      }

      else if (item.name === "New Job") {
        handleOpenCreateJob();
      }

      else if (item.name === "Job Application List") {
        handleOpenJobApplicationList();
      }

      else if (item.name === "Home") {
        updatedParams.delete("filter");
        const queryString = updatedParams.toString();
        const updatedPath = queryString ? `${location.pathname}?${queryString}` : location.pathname;
        navigate(updatedPath);
      } else {
        updatedParams.set("filter", item.value);
        navigate(`${location.pathname}?${updatedParams.toString()}`);
      }

      setActiveMenu(item.name);
    };

    const handleLogout=()=>{
      dispatch(logout());
      console.log("Handle logout")
    }
  return (
    <>
      <div className='card min-h-[85vh] flex flex-col justify-center w-[20vw]'>
        <div className='space-y-5 h-full'>
            <div className='flex justify-center'>
                <Avatar sx={{width: "8rem", height: "8rem"}}
                  className='border-2 border-[#4d7fd0]'
                  src='https://wilang.org/wp-content/uploads/2016/04/lion-1.jpg'>
                </Avatar> 
            </div>
            {
              menu
                .filter((item) => item.role.includes(role))
                .map((item) => (
                  <p
                    key={item.name}
                    onClick={() => handleMenuChange(item)}
                    className={`py-3 px-5 rounded-full text-center cursor-pointer ${
                      activeMenu === item.name ? "activeMenuItem" : "menuItem"
                    }`}
                  >
                    {item.name}
                  </p>
                ))
            }

            <Button onClick={handleLogout} sx={{padding:".7rem", borderRadius:"2rem"}} fullWidth className='logoutButton'>Logout</Button>

        </div>
    </div>
    <JobList open={openListOfJobs} handleClose={handleCloseListOfJobs}/>
    <CompleteApplicantProfile open={openApplicantProfile} onClose={onCloseApplicantProfile}/>
    <ApplicantList open={openListOfApplicants} handleClose={handleCloseListOfApplicants}/>
    <CreateCompany open={openCreateCompany} handleClose={handleCloseCreateCompany}/>
    <CreateJob open={openCreateJob} handleClose={handleCloseCreateJob}/>
    <JobApplicationList open={openJobApplicationList} handleClose={handleCloseJobApplicationList}/>
    </>
  )
}

export default Sidebar;