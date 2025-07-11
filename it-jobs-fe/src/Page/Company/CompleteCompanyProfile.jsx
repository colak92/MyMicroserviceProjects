import React, { useEffect, useState } from 'react';
import {
  Box,
  Modal,
  TextField,
  Autocomplete,
  Button,
  Rating,
  CircularProgress,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  createCompany,
  fetchCompanyProfile,
  updateCompany,
} from '../../ReduxToolkit/CompanySlice';
import { fetchAllFounders } from '../../ReduxToolkit/FounderSlice';

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

export default function CompleteCompanyProfile({ open, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const companyDetails = useSelector((state) => state.company.companyDetails);
  const founders = useSelector((state) => state.founder.founders || []);
  const foundersLoading = useSelector((state) => state.founder.loading);

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    email: '',
    foundedDate: null,
    rate: 0,
  });
  const [selectedFounders, setSelectedFounders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch founders once if not loaded
  useEffect(() => {
    if (founders.length === 0 && !foundersLoading) {
      dispatch(fetchAllFounders());
    }
  }, [dispatch, founders.length, foundersLoading]);

  // Sync formData and selectedFounders with Redux state when modal opens or companyDetails changes
  useEffect(() => {
    if (open) {
      setFormData({
        name: companyDetails?.name || user?.fullName || '',
        logo: companyDetails?.logo || '',
        description: companyDetails?.description || '',
        email: companyDetails?.email || user?.email || '',
        foundedDate: companyDetails?.foundedDate ? dayjs(companyDetails.foundedDate) : null,
        rate: companyDetails?.rate || 0,
      });
      setSelectedFounders(companyDetails?.founders || []);
      setError(null);
    }
  }, [companyDetails, user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const companyData = {
      ...formData,
      foundedDate: formData.foundedDate ? formData.foundedDate.toISOString() : null,
      founders: selectedFounders.map((f) => ({ id: f.id })),
      userId: user?.id,
    };

    try {
      if (companyDetails?.id) {
        await dispatch(
          updateCompany({ id: companyDetails.id, updatedCompanyData: companyData })
        ).unwrap();
      } else {
        await dispatch(createCompany({ companyData })).unwrap();
      }

      // Refresh company profile to sync redux store
      await dispatch(fetchCompanyProfile());
      onClose();
    } catch (err) {
      console.error('Error saving company profile:', err.message);
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="complete-company-profile-modal"
      aria-describedby="company-profile-form"
    >
      <Box sx={style}>
        <Typography id="complete-company-profile-modal" variant="h5" mb={3}>
          Complete Your Company Profile
        </Typography>
        <form onSubmit={handleSubmit} id="company-profile-form" noValidate>
          <TextField
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Logo URL"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
          />

          <Autocomplete
            multiple
            options={founders}
            getOptionLabel={(option) => option.name}
            value={selectedFounders}
            onChange={(event, newValue) => setSelectedFounders(newValue)}
            loading={foundersLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Founders"
                margin="normal"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {foundersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            
          
            <DatePicker
              fullWidth
              label="Founded Date"
              value={formData.foundedDate}
              onChange={(newValue) =>
                setFormData((prev) => ({ ...prev, foundedDate: newValue }))
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <Box mt={2} mb={3} display="flex" alignItems="center" gap={1}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rate"
              value={formData.rate}
              precision={0.5}
              onChange={(e, newValue) =>
                setFormData((prev) => ({ ...prev, rate: newValue || 0 }))
              }
            />
          </Box>

          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Saving...' : companyDetails?.id ? 'Update Profile' : 'Save Profile'}
            </Button>
            <Button type="button" color="secondary" onClick={onClose} disabled={loading}>
              Close without saving
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
