import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useDispatch, useSelector } from "react-redux";
import { createJob } from "../../ReduxToolkit/JobSlice";
import { fetchAllCompanies } from "../../ReduxToolkit/CompanySlice";
import { JOB_SENIORITY_OPTIONS } from "../../constants/jobSeniority";

const style = {
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

const necessarySkills = ["Java", "Spring Boot", "Docker", "Kubernetes", "React", "Swift"];
const additionalSkills = ["Linux", "SQL", "Mui", "Git", "UX/UI Design"];

export default function CreateJob({ handleClose, open }) {
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.company.companies); // Make sure this matches your slice
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    seniority: "",
    description: "",
    deadline: null,
    necessarySkills: [],
    additionalSkills: [],
    companyId: null,
  });

  const [selectedNecessarySkills, setSelectedNecessarySkills] = useState([]);
  const [selectedAdditionalSkills, setSelectedAdditionalSkills] = useState([]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        await dispatch(fetchAllCompanies()).unwrap();
      } catch (err) {
        console.error("Failed to load companies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNecessarySkillsChange = (event, value) => {
    setSelectedNecessarySkills(value);
  };

  const handleAdditionalSkillsChange = (event, value) => {
    setSelectedAdditionalSkills(value);
  };

  const handleDeadlineChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      deadline: date,
    }));
  };

  const formatDate = (date) => {
    return date ? date.toISOString() : null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = {
      ...formData,
      deadline: formatDate(formData.deadline),
      necessarySkills: selectedNecessarySkills,
      additionalSkills: selectedAdditionalSkills,
      companyId: selectedCompany?.id || null,
    };

    try {
      await dispatch(createJob({ jobData: submitData }));
      handleClose();
    } catch (err) {
      console.error("Error dispatching createJob:", err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-job-modal"
      aria-describedby="modal-for-creating-job"
    >
      <Box sx={style}>
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
              <Autocomplete
                sx={{ minWidth: 300 }}
                options={JOB_SENIORITY_OPTIONS}
                getOptionLabel={(option) => option.label}
                value={JOB_SENIORITY_OPTIONS.find(
                  (opt) => opt.value === formData.seniority
                ) || null}
                onChange={(event, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    seniority: newValue?.value || "",
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Seniority" fullWidth />
                )}
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ minWidth: 300 }}
                  label="Deadline"
                  value={formData.deadline}
                  onChange={handleDeadlineChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                sx={{ minWidth: 300 }}
                multiple
                options={necessarySkills}
                value={selectedNecessarySkills}
                onChange={handleNecessarySkillsChange}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField label="Important Skills" fullWidth {...params} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                sx={{ minWidth: 300 }}
                multiple
                options={additionalSkills}
                value={selectedAdditionalSkills}
                onChange={handleAdditionalSkillsChange}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField label="Nice to have" fullWidth {...params} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                sx={{ minWidth: 300 }}
                options={companies}
                getOptionLabel={(option) => option?.name || ""}
                value={selectedCompany}
                onChange={(event, newValue) => {
                  setSelectedCompany(newValue);
                }}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Company"
                    variant="outlined"
                    slotProps={{
                      ...params.slotProps,
                      endAdornment: (
                        <>
                          {loading && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth type="submit" sx={{ padding: ".9rem" }}>
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}