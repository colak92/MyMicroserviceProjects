import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {
  Autocomplete,
  Button,
  Grid,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  fetchAllCompanies,
  fetchCompanyById,
  updateCompany,
} from '../../ReduxToolkit/CompanySlice';
import { fetchAllFounders } from '../../ReduxToolkit/FounderSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function EditCompany({ item, handleClose, open }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const founders = useSelector((state) => state.founder.founders);
  const companyDetails = useSelector((state) => state.company.companyDetails);

  const [selectedFounders, setSelectedFounders] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    email: '',
    foundedDate: new Date().toISOString(),
    rate: '',
  });

  // 🔁 Load company and founders on open
  useEffect(() => {
    if (item?.id) {
      dispatch(fetchCompanyById({ companyId: item.id }));
    }

    dispatch(fetchAllFounders());
  }, [dispatch, item?.id]);

  // 🎯 When company details are fetched
  useEffect(() => {
    if (companyDetails && companyDetails.id === item.id) {
      setFormData({
        name: companyDetails.name || '',
        logo: companyDetails.logo || '',
        description: companyDetails.description || '',
        email: companyDetails.email || '',
        foundedDate: companyDetails.foundedDate
          ? new Date(companyDetails.foundedDate)
          : new Date(),
        rate: companyDetails.rate || '',
      });

      setSelectedFounders(
        Array.isArray(companyDetails.founders) ? companyDetails.founders : []
      );
      setLoading(false);
    }
  }, [companyDetails, item.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFoundedDateChange = (date) => {
    setFormData((prev) => ({ ...prev, foundedDate: date }));
  };

  const handleFoundersChange = (event, value) => {
    setSelectedFounders(value);
  };

  const formatDate = (input) => {
    if (!input) return new Date().toISOString();
    const date = new Date(input);
    return date.toISOString();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedCompany = {
      id: item.id,
      updatedCompanyData: {
        ...formData,
        founders: selectedFounders.map((f) => ({ id: f.id })),
        foundedDate: formatDate(formData.foundedDate),
      },
    };

    dispatch(updateCompany(updatedCompany))
      .unwrap()
      .then(() => {
        dispatch(fetchAllCompanies());
        dispatch(fetchAllFounders());
        handleClose();
      })
      .catch((error) => {
        console.error('Update failed: ', error.message);
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {loading ? (
          <Typography>Loading company data...</Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={2} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  sx={{ minWidth: 300 }}
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  sx={{ minWidth: 300 }}
                  label="Logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  sx={{ minWidth: 300 }}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  sx={{ minWidth: 300 }}
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Founded Date"
                    value={dayjs(formData.foundedDate)}
                    onChange={handleFoundedDateChange}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  sx={{ minWidth: 300 }}
                  multiple
                  options={founders}
                  value={selectedFounders}
                  onChange={handleFoundersChange}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField label="Founders" {...params} fullWidth />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontWeight="bold">Rating:</Typography>
                  <Rating
                    name="rate"
                    value={parseFloat(formData.rate) || 0}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        rate: newValue?.toString() || '0',
                      }));
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained">
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
    </Modal>
  );
}
