import React, { useEffect } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobApplicationsByCompany } from '../../ReduxToolkit/JobApplicationSlice';
import { fetchAllApplicants } from '../../ReduxToolkit/ApplicantSlice';
import { fetchAllJobs } from '../../ReduxToolkit/JobSlice';
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

const JobApplicationList = ({ open, handleClose, companyId }) => {
  const dispatch = useDispatch();

  const jobApplications = useSelector((state) => state.jobApplication.jobApplications);
  const jobs = useSelector((state) => state.job.jobs); // from your job slice
  const applicants = useSelector((state) => state.applicant.applicants); // from applicant slice

  const loading = useSelector((state) => state.jobApplication.loading);
  const error = useSelector((state) => state.jobApplication.error);

  useEffect(() => {
    if (open && companyId) {
      dispatch(fetchJobApplicationsByCompany(companyId));
      dispatch(fetchAllApplicants());
      dispatch(fetchAllJobs());
    }
  }, [dispatch, open, companyId]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" gutterBottom>
          Job Application List
        </Typography>

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && jobApplications.length === 0 && (
          <Typography>No job applications found.</Typography>
        )}

        {!loading && jobApplications.length > 0 && (
          jobApplications.map((jobApplication) => {
            const job = jobs.find(j => j.id === jobApplication.jobId);
            const applicant = applicants.find(a => a.id === jobApplication.applicantId);

            return (
              <JobApplicationCard
                key={jobApplication.id}
                item={jobApplication}
                job={job}
                applicant={applicant}
              />
            );
          })
        )}

        <Box mt={2} display="flex" justifyContent="flex-end">
          <button onClick={handleClose}>Close</button>
        </Box>
      </Box>
    </Modal>
  );
};

export default JobApplicationList;