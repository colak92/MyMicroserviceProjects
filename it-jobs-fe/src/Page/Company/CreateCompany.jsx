import React, { useState } from "react";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch } from "react-redux";
import {
  createCompany,
  fetchAllCompanies,
} from "../../ReduxToolkit/CompanySlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

const jobOptions = [
  "FrontEnd Dev",
  "BackEnd Dev",
  "Full Stack Dev",
  "Administrator",
  "Tester",
  "IOS Dev"
];

const founderOptions = [
  "Steve Jobs",
  "Steve Wozniak",
  "Michail Dell",
  "Bill Hewlett",
  "Ronald Wayne",
  "David Packard",
];

export default function CreateCompany({ open, handleClose }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
    email: "",
    foundedDate: null,
    rate: 0,
  });

  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedFounders, setSelectedFounders] = useState([]);

  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
      description: "",
      email: "",
      foundedDate: null,
      rate: 0,
    });
    setSelectedJobs([]);
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
      jobs: selectedJobs,
      founders: selectedFounders,
    };

    try {
      await dispatch(createCompany({ companyData: submitData })).unwrap();
      await dispatch(fetchAllCompanies());
      handleClose();
      resetForm();
    } catch (error) {
      console.error("Company creation failed:", error);
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
      <Box sx={modalStyle}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column" alignItems="center">
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
                label="Logo URL"
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
                multiline
                rows={3}
                fullWidth
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
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
              sx={{ minWidth: 300 }}
                multiple
                options={jobOptions}
                value={selectedJobs}
                onChange={(e, value) => setSelectedJobs(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Jobs" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
              sx={{ minWidth: 300 }}
                multiple
                options={founderOptions}
                value={selectedFounders}
                onChange={(e, value) => setSelectedFounders(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Founders" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                sx={{ minWidth: 300 }}
                  label="Founded Date"
                  value={formData.foundedDate}
                  onChange={(newDate) =>
                    setFormData((prev) => ({ ...prev, foundedDate: newDate }))
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography fontWeight="bold">Rating:</Typography>
                <Rating
                  name="rate"
                  value={parseFloat(formData.rate) || 0}
                  precision={0.5}
                  onChange={(e, newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      rate: newValue?.toString() || "0",
                    }))
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth sx={{ padding: ".9rem" }}>
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}