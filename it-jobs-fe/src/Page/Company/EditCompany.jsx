import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  Autocomplete,
  Button,
  Grid,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  fetchAllCompanies,
  fetchCompanyById,
  updateCompany,
} from "../../ReduxToolkit/CompanySlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const jobs = [
  "FrontEnd Dev",
  "BackEnd Dev",
  "Full Stack",
  "Administrator",
  "Tester",
];

export default function EditCompany({ item, handleClose, open }) {
  const dispatch = useDispatch();
  const company = useSelector((store) => store.company);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
    email: "",
    foundedDate: new Date().toISOString(),
    founders: [],
    jobs: [],
    rate: "",
  });

  const [loading, setLoading] = useState(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJobsChange = (event, value) => {
    setFormData((prev) => ({
      ...prev,
      jobs: value,
    }));
  };

  const handleFoundersChange = (event, value) => {
    setFormData((prev) => ({
      ...prev,
      founders: value,
    }));
  };

  const handleFoundedDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      foundedDate: date,
    }));
  };

  const formatDate = (input) => {
    if (!input) return new Date().toISOString();
    const date = new Date(input);
    return date.toISOString();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("New form data:", JSON.stringify(formData, null, 2));

    const updatedCompany = {
      id: item.id,
      updatedCompanyData: {
        ...formData,
        foundedDate: formatDate(formData.foundedDate),
      },
    };

    dispatch(updateCompany(updatedCompany))
      .unwrap()
      .then(() => {
        console.log("Company updated successfully.");
        dispatch(fetchAllCompanies());
        handleClose();
      })
      .catch((err) => {
        console.error("Update failed:", err);
      });
  };

  useEffect(() => {
    if (item?.id) {
      dispatch(fetchCompanyById({ companyId: item.id }));
    }
  }, [dispatch, item?.id]);

  useEffect(() => {
    if (company.companyDetails && company.companyDetails.id === item.id) {
      setFormData({
        name: company.companyDetails.name || "",
        logo: company.companyDetails.logo || "",
        description: company.companyDetails.description || "",
        email: company.companyDetails.email || "",
        foundedDate: company.companyDetails.foundedDate
          ? new Date(company.companyDetails.foundedDate)
          : new Date(),
        founders: Array.isArray(company.companyDetails.founders)
          ? company.companyDetails.founders
          : [],
        jobs: Array.isArray(company.companyDetails.jobs)
          ? company.companyDetails.jobs
          : [],
        rate: company.companyDetails.rate || "",
      });
      setLoading(false);
    }
  }, [company.companyDetails, item.id]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {loading ? (
          <p>Loading company data...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={2} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  sx={{ minWidth: 300 }}
                  label="Name"
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ minWidth: 300 }}
                  label="Logo"
                  fullWidth
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ minWidth: 300 }}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
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
                  placeholder="Enter your email..."
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  sx={{ minWidth: 300 }}
                  multiple
                  id="multiple-limit-jobs"
                  options={jobs}
                  value={formData.jobs}
                  onChange={handleJobsChange}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField label="Jobs" fullWidth {...params} />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ minWidth: 300 }}
                    label="Founded"
                    value={dayjs(formData.foundedDate)}
                    onChange={handleFoundedDateChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  sx={{ minWidth: 300 }}
                  multiple
                  id="multiple-limit-founders"
                  options={jobs}
                  value={formData.founders}
                  onChange={handleFoundersChange}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField label="Founders" fullWidth {...params} />
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
                        rate: newValue?.toString() || "0",
                      }));
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth type="submit" sx={{ padding: ".9rem" }}>
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
