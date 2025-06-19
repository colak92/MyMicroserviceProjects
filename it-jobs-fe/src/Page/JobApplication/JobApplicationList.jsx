import React, { useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllJobApplications } from '../../ReduxToolkit/JobApplicationSlice';
import JobApplicationCard from './JobApplicationCard';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  overflowY: 'auto',
};

const JobApplicationList = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  const jobApplications = useSelector((state) => state.jobApplication.jobApplications);
  const loading = useSelector((state) => state.job.loading);
  const error = useSelector((state) => state.job.error);

  useEffect(() => {
    if (open) {
      dispatch(fetchAllJobApplications());
    }
  }, [dispatch, open]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" gutterBottom>
          Job Application List
        </Typography>

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && jobApplications.length === 0 && (
          <Typography>No jobs applications.</Typography>
        )}

        {!loading &&
          jobApplications.map((jobApplication) => (
            <JobApplicationCard key={jobApplication.id} item={jobApplication} disableJobApplicationList={true} />
          ))}

        <Box mt={2} display="flex" justifyContent="flex-end">
          <button onClick={handleClose}>Close</button>
        </Box>
      </Box>
    </Modal>
  );
};

export default JobApplicationList;
