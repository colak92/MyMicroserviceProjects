import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Box,
  Modal,
  Rating,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCompany,
  fetchAllCompanies,
} from '../../ReduxToolkit/CompanySlice';
import { fetchAllFounders } from '../../ReduxToolkit/FounderSlice';
import { fetchJobsByCompany } from '../../ReduxToolkit/JobSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  outline: 'none',
  boxShadow: 24,
  p: 4,
};

export default function CreateCompany({ open, handleClose }) {
  const dispatch = useDispatch();
  const founders = useSelector((state) => state.founder.founders || []);
  const [loading, setLoading] = useState(false);
  const [selectedFounders, setSelectedFounders] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    email: '',
    foundedDate: null,
    rate: 0,
  });

  useEffect(() => {
    const loadFounders = async () => {
      try {
        setLoading(true);
        await dispatch(fetchAllFounders()).unwrap();
      } catch (error) {
        console.error('Failed to load founders: ', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadFounders();
    }
  }, [dispatch, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      logo: '',
      description: '',
      email: '',
      foundedDate: null,
      rate: 0,
    });
    setSelectedFounders([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      foundedDate: formData.foundedDate
        ? formData.foundedDate.toISOString()
        : null,
      founders: selectedFounders.map((f) => ({ id: f.id })),
      userId: user?.id,
    };

    try {
      const createdCompany = await dispatch(createCompany({ companyData: submitData })).unwrap();
      await dispatch(fetchAllCompanies()).unwrap();
      await dispatch(fetchJobsByCompany(createdCompany.id)).unwrap();
      handleClose();
      resetForm();
    } catch (error) {
      console.error('Company creation failed: ', error.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        resetForm();
      }}
      aria-labelledby="create-company-modal"
      aria-describedby="modal-for-creating-company"
    >
      <Box sx={style}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <TextField
                fullWidth
                required
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                label="Logo URL"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
              />
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item>
              <Autocomplete
                multiple
                options={founders}
                getOptionLabel={(option) => option.name}
                value={selectedFounders}
                onChange={(e, newValue) => setSelectedFounders(newValue)}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Founders"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Founded Date"
                  value={formData.foundedDate}
                  onChange={(newDate) =>
                    setFormData((prev) => ({ ...prev, foundedDate: newDate }))
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography fontWeight="bold">Rating:</Typography>
                <Rating
                  name="rate"
                  value={Number(formData.rate) || 0}
                  precision={0.5}
                  onChange={(e, newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      rate: newValue || 0,
                    }))
                  }
                />
              </Box>
            </Grid>

            <Grid item>
              <Button fullWidth type="submit" variant="contained">
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}
