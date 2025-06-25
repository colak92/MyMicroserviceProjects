import { IconButton, Menu, MenuItem, Rating, Typography } from '@mui/material';
import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CompanyList from './CompanyList';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  deleteCompany,
  fetchAllCompanies,
} from '../../ReduxToolkit/CompanySlice';
import UserList from '../User/UserList';
import dayjs from 'dayjs';
import EditCompany from './EditCompany';
import JobList from '../Job/JobList';
import { COMPANY_STATUS_OPTIONS } from '../../constants/companyStatus';

const CompanyCard = ({ item, disableCompanyList = false }) => {
  const getStatusLabel = (value) =>
    COMPANY_STATUS_OPTIONS.find((option) => option.value === value)?.label ||
    value;
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((store) => store.auth);

  // Select all jobs and filter those belonging to this company
  const jobs = useSelector((state) => state.job.jobs || []);
  const companyJobs = jobs.filter((job) => job.companyId === item.id);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [openUserList, setOpenUserList] = useState(false);
  const [openAssignedJobList, setOpenAssignedJobList] = useState(false);
  const [openCompanyList, setOpenCompanyList] = useState(false);
  const [openUpdateCompany, setOpenUpdateCompany] = useState(false);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleCloseUserList = () => setOpenUserList(false);
  const handleCloseAssignedJobList = () => setOpenAssignedJobList(false);
  const handleCloseCompanyList = () => setOpenCompanyList(false);
  const handleCloseUpdateCompany = () => setOpenUpdateCompany(false);

  const handleOpenUserList = () => {
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.set('companyId', item.id);
    navigate(`${location.pathname}?${updatedParams.toString()}`);
    setOpenUserList(true);
    handleMenuClose();
  };

  const handleOpenAssignedJobList = () => {
    setOpenAssignedJobList(true);
    handleMenuClose();
  };

  const handleOpenUpdateCompany = () => {
    setOpenUpdateCompany(true);
    handleMenuClose();
  };

  const handleOpenDeleteCompany = () => {
    dispatch(deleteCompany({ companyId: item.id }));
    dispatch(fetchAllCompanies());
    handleMenuClose();
  };

  return (
    <div>
      <div className="card lg:flex justify-between w-full">
        <div className="lg:flex gap-5 items-center space-y-2 w-full">
          <div className="flex-shrink-0 w-[12rem] h-[12rem]">
            <img
              className="w-full h-full object-cover rounded-md"
              src={item.logo}
              alt={`${item.name} logo`}
            />
          </div>

          <div className="space-y-5 flex-1">
            <div className="space-y-2">
              <h1 className="font-bold text-lg">{item.name}</h1>

              <p className="text-amber-700 text-sm">
                <span
                  style={{ color: 'rgb(77, 127, 208)' }}
                  className="font-semibold"
                >
                  Status:
                </span>{' '}
                {getStatusLabel(item.status)}
              </p>

              <Typography variant="body2" className="text-amber-700">
                <span
                  style={{ color: 'rgb(77, 127, 208)' }}
                  className="font-semibold"
                >
                  About Us:
                </span>{' '}
                {item.description}
              </Typography>

              <p className="text-amber-700 text-sm">
                <span
                  style={{ color: 'rgb(77, 127, 208)' }}
                  className="font-semibold"
                >
                  Email:
                </span>{' '}
                {item.email}
              </p>

              <p className="text-amber-700 text-sm">
                <span
                  style={{ color: 'rgb(77, 127, 208)' }}
                  className="font-semibold"
                >
                  Founded:
                </span>{' '}
                {dayjs(item.foundedDate).format('MMMM D, YYYY')}
              </p>

              <p className="text-amber-700 text-sm">
                <span
                  style={{ color: 'rgb(77, 127, 208)' }}
                  className="font-semibold"
                >
                  Founders:
                </span>{' '}
                {item.founders?.map((f) => f.name).join(', ') || 'None'}
              </p>

              <p className="text-amber-700 text-sm flex items-center">
                <span
                  style={{ color: 'rgb(77, 127, 208)' }}
                  className="font-semibold mr-2"
                >
                  Rate:
                </span>
                <Rating value={item.rate} precision={0.5} readOnly />
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {companyJobs.length > 0 ? (
                companyJobs.map((job) => (
                  <Link
                    to={`/jobs/${job.id}`}
                    key={job.id}
                    className="py-1 px-5 rounded-full techStack text-amber-700 hover:underline hover:text-blue-600 transition"
                  >
                    {job.name}
                  </Link>
                ))
              ) : (
                <Typography className="text-gray-500 italic">
                  This company has no job postings.
                </Typography>
              )}
            </div>
          </div>
        </div>

        <div>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
            {auth.user?.role === 'ROLE_ADMIN' ? (
              <>
                <MenuItem onClick={handleOpenAssignedJobList}>Jobs</MenuItem>
                <MenuItem onClick={handleOpenUpdateCompany}>Edit</MenuItem>
                <MenuItem onClick={handleOpenDeleteCompany}>Delete</MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={handleOpenAssignedJobList}>Jobs</MenuItem>
                <MenuItem onClick={handleOpenUserList}>User List</MenuItem>
              </>
            )}
          </Menu>
        </div>
      </div>

      <JobList
        open={openAssignedJobList}
        handleClose={handleCloseAssignedJobList}
        companyId={item.id}
      />
      <UserList open={openUserList} handleClose={handleCloseUserList} />
      <EditCompany
        item={item}
        open={openUpdateCompany}
        handleClose={handleCloseUpdateCompany}
      />
      {!disableCompanyList && (
        <CompanyList
          open={openCompanyList}
          handleClose={handleCloseCompanyList}
        />
      )}
    </div>
  );
};

export default CompanyCard;
