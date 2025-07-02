import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  createApplicant,
  updateApplicant,
  fetchApplicantProfile,
} from '../../ReduxToolkit/ApplicantSlice';

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

const CompleteApplicantProfile = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const applicantDetails = useSelector(
    (state) => state.applicant.applicantDetails
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resumeUrl: '',
    skills: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData({
      name: applicantDetails?.name || user?.fullName || '',
      email: applicantDetails?.email || user?.email || '',
      resumeUrl: applicantDetails?.resumeUrl || '',
      skills: applicantDetails?.skills || '',
    });
  }, [applicantDetails, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const applicantData = {
        userId: user.id,
        ...formData,
      };

      if (applicantDetails?.id) {
        await dispatch(
          updateApplicant({
            id: applicantDetails.id,
            updatedApplicantData: applicantData,
          })
        ).unwrap();
      } else {
        await dispatch(createApplicant({ applicantData })).unwrap();
      }

      dispatch(fetchApplicantProfile());
      onClose();
    } catch (error) {
      console.error('Error saving profile: ', error.message);
      setError(error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    onClose();
    setError(null);
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="complete-profile-modal"
      aria-describedby="modal-to-complete-applicant-profile"
    >
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Complete Your Applicant Profile
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <TextField
                fullWidth
                required
                name="name"
                label="Full Name"
                value={formData.name}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                required
                type="email"
                name="email"
                label="Email"
                value={formData.email}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                required
                name="resumeUrl"
                label="Resume URL"
                value={formData.resumeUrl}
                onChange={handleChange}
              />
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                required
                name="skills"
                label="Skills (comma separated)"
                value={formData.skills}
                onChange={handleChange}
              />
            </Grid>

            {error && (
              <Grid item>
                <Typography color="error" fontSize="0.875rem">
                  {error}
                </Typography>
              </Grid>
            )}

            <Grid item container justifyContent="space-between">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  'Save Profile'
                )}
              </Button>
              <Button
                variant="text"
                color="secondary"
                onClick={handleModalClose}
              >
                Close without saving
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default CompleteApplicantProfile;