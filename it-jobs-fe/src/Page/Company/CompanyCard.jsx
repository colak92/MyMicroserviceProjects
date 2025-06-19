import { IconButton, Menu, MenuItem, Rating, Typography } from '@mui/material';
import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CompanyList from './CompanyList';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteCompany, fetchAllCompanies } from '../../ReduxToolkit/CompanySlice';
import UserList from '../User/UserList';
import dayjs from 'dayjs';
import EditCompany from './EditCompany';
import JobList from '../Job/JobList';
import { COMPANY_STATUS_OPTIONS } from '../../constants/companyStatus';

const CompanyCard = ({ item, disableCompanyList = false }) => {

  const getStatusLabel = (value) => COMPANY_STATUS_OPTIONS.find((option) => option.value === value)?.label || value;
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSelector(store => store.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // user list
  const [openUserList, setOpenUserList] = useState(false);
  const handleCloseUserList = () => {
    setOpenUserList(false);
  };
  const handleOpenUserList = () => {
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.set("companyId", item.id);
    navigate(`${location.pathname}?${updatedParams.toString()}`);

    setOpenUserList(true);
    handleMenuClose();
  };

  // assigned jobs
  const [openAssignedJobList, setOpenAssignedJobList] = useState(false);
  const handleCloseAssignedJobList = () => {
    setOpenAssignedJobList(false);
  };
  const handleOpenAssignedJobList = () => {
    setOpenAssignedJobList(true);
    handleMenuClose();
  };

  // company list
  const [openCompanyList, setOpenCompanyList] = useState(false);
  const handleCloseCompanyList = () => {
    setOpenCompanyList(false);
  };

  // update company
  const [openUpdateCompany, setOpenUpdateCompany] = useState(false);
  const handleCloseUpdateCompany = () => {
    setOpenUpdateCompany(false);
  };
  const handleOpenUpdateCompany = () => {
    console.log('Check why as customer refresh not working.')
    setOpenUpdateCompany(true);
    handleMenuClose();
  };

  // delete company
  const handleOpenDeleteCompany = () => {
    console.log('Item id: ' + item.id);
    dispatch(deleteCompany({ companyId: item.id }));
    dispatch(fetchAllCompanies());
    handleMenuClose();
  };

  return (
    <div>
      <div className='card lg:flex justify-between w-full'>
        <div className='lg:flex gap-5 items-center space-y-2 w-full'>

          <div className="flex-shrink-0 w-[12rem] h-[12rem]">
            <img
              className="w-full h-full object-cover rounded-md"
              src={item.logo}
              alt={`${item.name} logo`}
            />
          </div>

          <div className='space-y-5 flex-1'>
            <div className='space-y-2'>
              <h1 className='font-bold text-lg'>{item.name}</h1>

              <p className="text-amber-700 text-sm" data-testid="companyStatus">
                <span style={{ color: "rgb(77, 127, 208)" }} className="font-semibold">
                  Status:
                </span>{" "}
                {getStatusLabel(item.status)}
              </p>

              <Typography variant="body2" className="text-amber-700">
                <span style={{ color: 'rgb(77, 127, 208)' }} className="font-semibold">About Us:</span> {item.description}
              </Typography>

              <p className='text-amber-700 text-sm' data-testid="companyEmail">
                <span style={{ color: 'rgb(77, 127, 208)' }} className="font-semibold">Email:</span> {item.email}
              </p>

              <p className='text-amber-700 text-sm' data-testid="companyFounded">
                <span style={{ color: 'rgb(77, 127, 208)' }} className="font-semibold">Founded:</span> {dayjs(item.foundedDate).format("MMMM D, YYYY")}
              </p>

              <p className='text-amber-700 text-sm' data-testid="companyFounders">
                <span style={{ color: 'rgb(77, 127, 208)' }} className="font-semibold">Founders:</span> {item.founders?.join(', ')}
              </p>

              <p className='text-amber-700 text-sm flex items-center' data-testid="companyRate">
                <span style={{ color: 'rgb(77, 127, 208)' }} className="font-semibold mr-2">Rate:</span>
                <Rating value={item.rate} precision={0.5} readOnly />
              </p>
              

            </div>
            <div className='flex flex-wrap gap-2 items-center'>
              {item.jobs.map((job, index) => (
                <span key={index} className='py-1 px-5 rounded-full techStack text-amber-700'>
                  {job}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <IconButton
            id="basic-button"
            aria-controls={openMenu ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            slotProps={{ 'aria-labelledby': 'basic-button' }}
          >
            {auth.user?.role === "ROLE_ADMIN" ? (
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

      <JobList open={openAssignedJobList} handleClose={handleCloseAssignedJobList} companyId={item.id}/>
      <UserList open={openUserList} handleClose={handleCloseUserList} />
      <EditCompany item={item} open={openUpdateCompany} handleClose={handleCloseUpdateCompany}/>

      {!disableCompanyList && (
        <CompanyList open={openCompanyList} handleClose={handleCloseCompanyList} />
      )}
    </div>
  );
};

export default CompanyCard;