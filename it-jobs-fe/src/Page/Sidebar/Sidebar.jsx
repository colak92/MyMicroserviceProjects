import { Avatar, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import './Sidebar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAndClearAllState } from '../../ReduxToolkit/AuthSlice';

import CreateCompany from '../Company/CreateCompany';
import CreateJob from '../Job/CreateJob';
import JobList from '../Job/JobList';
import ApplicantList from '../Applicant/ApplicantList';
import CompleteApplicantProfile from '../Applicant/CompleteApplicantProfile';
import JobApplicationList from '../JobApplication/JobApplicationList';
import { fetchCompanyProfile } from '../../ReduxToolkit/CompanySlice';
import CompleteCompanyProfile from '../Company/CompleteCompanyProfile';

import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import WorkIcon from '@mui/icons-material/Work';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';
import PeopleIcon from '@mui/icons-material/People';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import UserList from '../User/UserList';

const menu = [
  {
    name: 'Home',
    value: 'HOME',
    icon: <HomeIcon />,
    role: ['ROLE_ADMIN', 'ROLE_APPLICANT', 'ROLE_COMPANY'],
  },
  {
    name: 'User List',
    value: '',
    icon: <PeopleIcon />,
    role: ['ROLE_ADMIN'],
  },
  {
    name: 'Assigned',
    value: 'ASSIGNED',
    icon: <TaskIcon />,
    role: ['ROLE_ADMIN'],
  },
  {
    name: 'My Applicant Profile',
    value: '',
    icon: <PersonIcon />,
    role: ['ROLE_APPLICANT'],
  },
  {
    name: 'My Company Profile',
    value: '',
    icon: <BusinessIcon />,
    role: ['ROLE_COMPANY'],
  },
  {
    name: 'Applicant List',
    value: '',
    icon: <PeopleOutlineIcon />,
    role: ['ROLE_ADMIN', 'ROLE_APPLICANT', 'ROLE_COMPANY'],
  },
  {
    name: 'Job List',
    value: '',
    icon: <WorkOutlineIcon />,
    role: ['ROLE_ADMIN', 'ROLE_APPLICANT', 'ROLE_COMPANY'],
  },
  {
    name: 'New Company',
    value: '',
    icon: <AddBusinessIcon />,
    role: ['ROLE_ADMIN'],
  },
  {
    name: 'New Job',
    value: '',
    icon: <WorkIcon />,
    role: ['ROLE_ADMIN', 'ROLE_COMPANY'],
  },
  {
    name: 'Job Application List',
    value: '',
    icon: <AssignmentIcon />,
    role: ['ROLE_ADMIN', 'ROLE_APPLICANT', 'ROLE_COMPANY'],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const role = user?.role || '';

  const companyDetails = useSelector((state) => state.company.companyDetails);
  const companyId = companyDetails?.id;
  const companyLoading = useSelector((state) => state.company.loading);
  const companyFetched = useSelector((state) => state.company.isFetched);

  const [activeMenu, setActiveMenu] = useState('Home');

  const [openJobList, setOpenJobList] = useState(false);
  const [openApplicantProfile, setOpenApplicantProfile] = useState(false);
  const [openCompanyProfile, setOpenCompanyProfile] = useState(false);
  const [openUserList, setOpenUserList] = useState(false);
  const [openApplicantList, setOpenApplicantList] = useState(false);
  const [openCreateCompany, setOpenCreateCompany] = useState(false);
  const [openCreateJob, setOpenCreateJob] = useState(false);
  const [openJobApplicationList, setOpenJobApplicationList] = useState(false);

  useEffect(() => {
    if (role === 'ROLE_COMPANY' && !companyFetched && !companyLoading) {
      dispatch(fetchCompanyProfile());
    }
  }, [dispatch, role, companyFetched, companyLoading]);

  const handleMenuChange = (item) => {
    const updatedParams = new URLSearchParams(location.search);

    switch (item.name) {
      case 'My Applicant Profile':
        setOpenApplicantProfile(true);
        break;
      case 'My Company Profile':
        setOpenCompanyProfile(true);
        break;
      case 'User List':
        setOpenUserList(true);
        break;
      case 'Applicant List':
        setOpenApplicantList(true);
        break;
      case 'Job List':
        setOpenJobList(true);
        break;
      case 'New Company':
        setOpenCreateCompany(true);
        break;
      case 'New Job':
        if (role === 'ROLE_COMPANY') {
          if (!companyFetched && companyLoading) {
            return;
          } else {
            if (!companyId) {
              setOpenCreateCompany(true);
            } else {
              setOpenCreateJob(true);
            }
          }
        } else {
          setOpenCreateJob(true);
        }
        break;
      case 'Job Application List':
        setOpenJobApplicationList(true);
        break;
      case 'Home':
        updatedParams.delete('filter');
        navigate(updatedParams.toString() ? `${location.pathname}?${updatedParams}` : location.pathname);
        break;
      default:
        updatedParams.set('filter', item.value);
        navigate(`${location.pathname}?${updatedParams}`);
    }

    setActiveMenu(item.name);
  };

  const handleLogout = () => {
    dispatch(logoutAndClearAllState());
  };

  return (
    <>
      <div className="card min-h-[85vh] flex flex-col justify-center w-[20vw]">
        <div className="space-y-5 h-full">
          <div className="flex justify-center">
            <Avatar
              sx={{ width: '8rem', height: '8rem' }}
              className="border-2 border-[#4d7fd0]"
              src="https://wilang.org/wp-content/uploads/2016/04/lion-1.jpg"
            />
          </div>
          {menu
            .filter((item) => item.role.includes(role))
            .map((item) => (
              <div
                key={item.name}
                onClick={() => handleMenuChange(item)}
                className={`menuItemWrapper ${
                  activeMenu.toLowerCase() === item.name.toLowerCase() ? 'activeMenuItem' : 'menuItem'
                }`}
              >
                {item.icon && <span className="iconWrapper">{item.icon}</span>}
                <span>{item.name}</span>
              </div>
            ))}
          <Button
            onClick={handleLogout}
            sx={{ padding: '.7rem', borderRadius: '2rem' }}
            fullWidth
            className="logoutButton"
          >
            Logout
          </Button>
        </div>
      </div>

      <JobList open={openJobList} handleClose={() => setOpenJobList(false)} />
      <CompleteApplicantProfile open={openApplicantProfile} onClose={() => setOpenApplicantProfile(false)} />
      <CompleteCompanyProfile open={openCompanyProfile} onClose={() => setOpenCompanyProfile(false)} />
      <UserList open={openUserList} handleClose={() => setOpenUserList(false)} />  
      <ApplicantList open={openApplicantList} handleClose={() => setOpenApplicantList(false)} />
      <CreateCompany open={openCreateCompany} handleClose={() => setOpenCreateCompany(false)} />
      <CreateJob open={openCreateJob} handleClose={() => setOpenCreateJob(false)} />
      <JobApplicationList
        open={openJobApplicationList}
        handleClose={() => setOpenJobApplicationList(false)}
        companyId={role === 'ROLE_COMPANY' ? companyId : undefined}
      />
    </>
  );
};

export default Sidebar;