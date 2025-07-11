import React, { useState } from 'react';
import JobList from './JobList';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditJob from './EditJob';
import { deleteJob, fetchAllJobs, fetchJobsByCompany } from '../../ReduxToolkit/JobSlice';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { JOB_SENIORITY_OPTIONS } from '../../constants/jobSeniority';
import { JOB_STATUS_OPTIONS } from '../../constants/jobStatus';
import ApplyJob from './ApplyJob';
import CompleteApplicantProfile from '../Applicant/CompleteApplicantProfile';
import { fetchApplicantProfile } from '../../ReduxToolkit/ApplicantSlice';

const JobCard = ({ item, disableJobList = false }) => {
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.company.companies);
  const user = useSelector((state) => state.auth.user);
  const company = companies.find((c) => c.id === item.companyId);
  
  const getStatusLabel = (value) => JOB_STATUS_OPTIONS.find((option) => option.value === value)?.label || value;
  const getSeniorityLabel = (value) => JOB_SENIORITY_OPTIONS.find((option) => option.value === value)?.label || value;

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [openJobList, setOpenJobList] = useState(false);

  const [openApplyJob, setOpenApplyJob] = useState(false);
  const [openCompleteProfile, setOpenCompleteProfile] = useState(false);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleCloseJobList = () => setOpenJobList(false);
  const handleCloseApplyJob = () => setOpenApplyJob(false);
  const handleCloseCompleteProfile = () => setOpenCompleteProfile(false);
  
  const [openUpdateJob, setOpenUpdateJob] = useState(false);
  const handleCloseUpdateJob = () => setOpenUpdateJob(false);

  const handleOpenApplyJob = async () => {
    handleMenuClose();
    if (user?.role === 'ROLE_APPLICANT') {
      try {
        const profile = await dispatch(fetchApplicantProfile()).unwrap();
        if (!profile?.resumeUrl || !profile?.skills) {
          console.warn('⚠️ Incomplete profile. Forcing modal.');
          setOpenCompleteProfile(true);
        } else {
          setOpenApplyJob(true);
        }
      } catch (error) {
        console.error('❌ Error fetching applicant profile', error.message);
        setOpenCompleteProfile(true);
      }
    }
  };

  const handleOpenUpdateJob = () => {
    setOpenUpdateJob(true);
    handleMenuClose();
  };

  const handleOpenDeleteJob = async () => {
  try {
    await dispatch(deleteJob({ jobId: item.id })).unwrap();
    dispatch(fetchAllJobs());
    await dispatch(fetchJobsByCompany(item.companyId)).unwrap();
  } catch (error) {
    console.error('Failed to delete job: ', error.message);
  }
  handleMenuClose();
};

  return (
    <div>
      <div className="card lg:flex justify-between w-full">
        <div className="lg:flex gap-5 items-center space-y-2 w-full">
          <div className="space-y-5 flex-1">
            <div className="space-y-2">
              <h1 className="font-bold text-lg">{item.name}</h1>
              <p className="text-amber-700 text-sm">
                <span className="font-semibold text-blue-700">Status:</span>{' '}
                {getStatusLabel(item.status)}
              </p>
              <p className="text-amber-700 text-sm">
                <span className="font-semibold text-blue-700">Seniority:</span>{' '}
                {getSeniorityLabel(item.seniority)}
              </p>
              <Typography variant="body2" className="text-amber-700">
                <span className="font-semibold text-blue-700">
                  Description:
                </span>{' '}
                {item.description}
              </Typography>
              <p className="text-amber-700 text-sm">
                <span className="font-semibold text-blue-700">Deadline:</span>{' '}
                {dayjs(item.deadline).format('YYYY-MM-DD HH:mm:ss')}
              </p>
              <p className="text-amber-700 text-sm">
                <span className="font-semibold text-blue-700">Company:</span>{' '}
                {company?.name || 'Unknown'}
              </p>
            </div>

            {item.necessarySkills?.length > 0 && (
              <div>
                <p className="font-semibold text-green-800">
                  Necessary Skills:
                </p>
                <div className="flex flex-wrap gap-2 mt-1 mb-3">
                  {item.necessarySkills.map((necessarySkill, index) => (
                    <span
                      key={index}
                      className="py-1 px-5 rounded-full bg-green-100 text-green-800"
                    >
                      {necessarySkill.name || necessarySkill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.additionalSkills?.length > 0 && (
              <div>
                <p className="font-semibold text-purple-800">Nice to have:</p>
                <div className="flex flex-wrap gap-2 mt-1 mb-3">
                  {item.additionalSkills.map((additionalSkill, index) => (
                    <span
                      key={index}
                      className="py-1 px-5 rounded-full bg-purple-100 text-purple-800"
                    >
                      {additionalSkill.name || additionalSkill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <IconButton
            id="basic-button"
            title="More options"
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
          >
            {user?.role === 'ROLE_APPLICANT' && (
              <MenuItem onClick={handleOpenApplyJob}>Apply</MenuItem>
            )}
            {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_COMPANY') && (
              <>
                <MenuItem onClick={handleOpenUpdateJob}>Edit</MenuItem>
                <MenuItem onClick={handleOpenDeleteJob}>Delete</MenuItem>
              </>
            )}
          </Menu>
        </div>
      </div>

      <ApplyJob
        item={item}
        open={openApplyJob}
        handleClose={handleCloseApplyJob}
      />
      <EditJob
        item={item}
        open={openUpdateJob}
        handleClose={handleCloseUpdateJob}
      />
      <CompleteApplicantProfile
        open={openCompleteProfile}
        onClose={handleCloseCompleteProfile}
      />

      {!disableJobList && (
        <JobList open={openJobList} handleClose={handleCloseJobList} />
      )}
    </div>
  );
};

export default JobCard;
