import React, { useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllJobs } from '../../ReduxToolkit/JobSlice';
import { fetchCompanyById } from '../../ReduxToolkit/CompanySlice';
import JobCard from './JobCard';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '100vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  overflowY: 'auto',
};

const JobList = ({ open, handleClose, companyId }) => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.job.jobs);
  const loading = useSelector((state) => state.job.loading);
  const error = useSelector((state) => state.job.error);

  useEffect(() => {
    if (open) {
      dispatch(fetchAllJobs());
      if (companyId != null) {
        dispatch(fetchCompanyById({ companyId }));
      }
    }
  }, [dispatch, open, companyId]);

  // Filter jobs for the company
  const filteredJobs = companyId
    ? jobs.filter((job) => job.companyId === companyId)
    : jobs;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" gutterBottom>
          Job List
        </Typography>

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && filteredJobs.length === 0 && (
          <Typography>No jobs available for this company.</Typography>
        )}

        {!loading &&
          filteredJobs.map((job) => (
            <JobCard key={job.id} item={job} disableJobList={true} />
          ))}

        <Box mt={2} display="flex" justifyContent="flex-end">
          <button onClick={handleClose}>Close</button>
        </Box>
      </Box>
    </Modal>
  );
};

export default JobList;
