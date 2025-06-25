import React, { useState } from 'react';
import {
  Button,
  Grid,
  TextField,
  Box,
  Modal,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { applyToJob } from '../../ReduxToolkit/JobApplicationSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  outline: 'none',
  boxShadow: 24,
  p: 4,
};

const ApplyJob = ({ item, handleClose, open }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { loading } = useSelector((state) => state.jobApplication);
  const companies = useSelector((state) => state.company.companies);
  const company = companies.find((c) => c.id === item.companyId);
  const companyName = company?.name || 'Unknown';
  const applicant = useSelector((state) => state.applicant.applicantDetails);
  const applicantId = applicant ? applicant.id : null;
  const [coverLetter, setCoverLetter] = useState('');

  const handleModalClose = () => {
    setCoverLetter('');
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert('You must be logged in to apply.');
      return;
    }

    if (!applicantId) {
      alert(
        'Applicant details not found. Please complete your profile before applying.'
      );
      return;
    }

    const jobApplicationData = {
      jobId: item.id,
      applicantId: applicantId,
      coverLetter,
    };

    try {
      await dispatch(applyToJob(jobApplicationData)).unwrap();
      alert('Applied successfully!');
      handleModalClose();
    } catch (error) {
      const backendMsg =
        error?.response?.data || error?.message || 'Unexpected error';
      console.error('Failed to apply for job: ', backendMsg.message);
      alert('Failed to apply: ' + backendMsg);
    }
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={style}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Apply for this Job
          </Typography>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                label="Job Title"
                value={item?.name || ''}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item>
              <TextField
                label="Company"
                value={companyName}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item>
              <TextField
                label="Your Name"
                value={user?.fullName || ''}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item>
              <TextField
                label="Your Email"
                value={user?.email || ''}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item>
              <TextField
                label="Cover Letter"
                multiline
                rows={4}
                fullWidth
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write your cover letter here (optional)"
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Apply'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ApplyJob;
