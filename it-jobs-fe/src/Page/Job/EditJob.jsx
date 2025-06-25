import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobById, updateJob } from '../../ReduxToolkit/JobSlice';
import { fetchAllCompanies } from '../../ReduxToolkit/CompanySlice';
import dayjs from 'dayjs';
import { JOB_SENIORITY_OPTIONS } from '../../constants/jobSeniority';
import { JOB_STATUS_OPTIONS } from '../../constants/jobStatus';

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

export default function EditJob({ item, handleClose, open }) {
  const dispatch = useDispatch();
  const jobDetails = useSelector((state) => state.job.jobDetails);
  const [companies, setCompanies] = useState([]);
  
  const necessarySkills = useSelector(
    (state) => state.necessarySkill.necessarySkills
  );
  const additionalSkills = useSelector(
    (state) => state.additionalSkill.additionalSkills
  );
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  const [selectedNecessarySkills, setSelectedNecessarySkills] = useState([]);
  const [selectedAdditionalSkills, setSelectedAdditionalSkills] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    status: '',
    seniority: '',
    description: '',
    deadline: null,
  });

  // Load companies
  useEffect(() => {
    const loadCompanies = async () => {
      setLoadingCompanies(true);
      try {
        const res = await dispatch(fetchAllCompanies()).unwrap();
        setCompanies(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error('Failed to load companies: ', error.message);
      } finally {
        setLoadingCompanies(false);
      }
    };
    loadCompanies();
  }, [dispatch]);

  // Fetch job details when modal opens or item changes
  useEffect(() => {
    if (item?.id && open) {
      dispatch(fetchJobById({ jobId: item.id }));
    }
  }, [dispatch, item?.id, open]);

  // Populate form fields and selections when jobDetails or companies update
  useEffect(() => {
    if (jobDetails && jobDetails.id === item?.id) {
      setFormData({
        name: jobDetails.name || '',
        status: jobDetails.status || '',
        seniority: jobDetails.seniority || '',
        description: jobDetails.description || '',
        deadline: jobDetails.deadline ? new Date(jobDetails.deadline) : null,
      });

      setSelectedNecessarySkills(
        Array.isArray(jobDetails.necessarySkills)
          ? jobDetails.necessarySkills
          : []
      );
      setSelectedAdditionalSkills(
        Array.isArray(jobDetails.additionalSkills)
          ? jobDetails.additionalSkills
          : []
      );

      // Find and set the company object matching companyId
      if (companies.length > 0) {
        const company = companies.find(
          (c) => c.id === jobDetails.companyId || c.id == jobDetails.companyId);
        setSelectedCompany(company || null);
      }
    }
  }, [jobDetails, companies, item?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const formatDate = (date) => (date ? date.toISOString() : null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedJobData = {
      ...formData,
      deadline: formatDate(formData.deadline),
      necessarySkills: selectedNecessarySkills,
      additionalSkills: selectedAdditionalSkills,
      companyId: selectedCompany?.id || null,
    };

    try {
      await dispatch(updateJob({ id: item.id, updatedJobData })).unwrap();
      handleClose();
    } catch (error) {
      console.error('Failed to update job: ', error.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-job-modal"
      aria-describedby="modal-for-editing-job"
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
                options={JOB_STATUS_OPTIONS}
                getOptionLabel={(option) => option.label}
                value={
                  JOB_STATUS_OPTIONS.find(
                    (opt) => opt.value === formData.status
                  ) || null
                }
                onChange={(event, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: newValue?.value || '',
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Status" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                sx={{ minWidth: 300 }}
                options={JOB_SENIORITY_OPTIONS}
                getOptionLabel={(option) => option.label}
                value={
                  JOB_SENIORITY_OPTIONS.find(
                    (opt) => opt.value === formData.seniority
                  ) || null
                }
                onChange={(event, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    seniority: newValue?.value || '',
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
                  value={formData.deadline ? dayjs(formData.deadline) : null}
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
                getOptionLabel={(option) => option?.name || ""}
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
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField label="Nice to have" fullWidth {...params} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                sx={{ minWidth: 300 }}
                options={companies}
                getOptionLabel={(option) => option?.name || ''}
                value={selectedCompany}
                onChange={(event, newValue) => setSelectedCompany(newValue)}
                loading={loadingCompanies}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Company"
                    variant="outlined"
                    slotProps={{
                      ...params.slotProps,
                      endAdornment: (
                        <>
                          {loadingCompanies ? (
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
            <Grid item xs={12}>
              <Button fullWidth type="submit" sx={{ padding: '.9rem' }}>
                Update
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}
