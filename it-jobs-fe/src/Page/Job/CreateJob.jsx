import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Box,
  Modal,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useDispatch, useSelector } from 'react-redux';
import { createJob } from '../../ReduxToolkit/JobSlice';
import { fetchAllCompanies } from '../../ReduxToolkit/CompanySlice';
import { fetchAllNecessarySkills } from '../../ReduxToolkit/NecessarySkillSlice';
import { fetchAllAdditionalSkills } from '../../ReduxToolkit/AdditionalSkillSlice';
import { JOB_SENIORITY_OPTIONS } from '../../constants/jobSeniority';

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

export default function CreateJob({ handleClose, open }) {
  const dispatch = useDispatch();

  const companies = useSelector((state) => state.company.companies);
  const necessarySkills = useSelector(
    (state) => state.necessarySkill.necessarySkills || []
  );
  const additionalSkills = useSelector(
    (state) => state.additionalSkill.additionalSkills || []
  );

  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedNecessarySkills, setSelectedNecessarySkills] = useState([]);
  const [selectedAdditionalSkills, setSelectedAdditionalSkills] = useState([]);
  const formatDate = (date) => (date ? date.toISOString() : null);

  const [formData, setFormData] = useState({
    name: '',
    seniority: '',
    description: '',
    deadline: null,
    companyId: null,
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchAllCompanies()).unwrap();
        await dispatch(fetchAllNecessarySkills()).unwrap();
        await dispatch(fetchAllAdditionalSkills()).unwrap();
      } catch (error) {
        console.error('Failed to load data: ', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeadlineChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      deadline: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      deadline: formatDate(formData.deadline),
      necessarySkills: selectedNecessarySkills.map((ns) => ({
        id: ns.id,
        name: ns.name,
      })),
      additionalSkills: selectedAdditionalSkills.map((as) => ({
        id: as.id,
        name: as.name,
      })),
      companyId: selectedCompany?.id || null,
    };

    try {
      await dispatch(createJob({ jobData: submitData }));
      handleClose();
    } catch (error) {
      console.error('Error creating job: ', error.message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <form onSubmit={handleSubmit}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                fullWidth
                label="Job Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item>
              <Autocomplete
                fullWidth
                options={JOB_SENIORITY_OPTIONS}
                getOptionLabel={(option) => option.label}
                value={
                  JOB_SENIORITY_OPTIONS.find(
                    (opt) => opt.value === formData.seniority
                  ) || null
                }
                onChange={(e, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    seniority: newValue?.value || '',
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Seniority" />
                )}
              />
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Deadline"
                  value={formData.deadline}
                  onChange={handleDeadlineChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item>
              <Autocomplete
                multiple
                options={necessarySkills}
                value={selectedNecessarySkills}
                onChange={(e, value) => setSelectedNecessarySkills(value)}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField label="Important Skills" {...params} />
                )}
              />
            </Grid>

            <Grid item>
              <Autocomplete
                multiple
                options={additionalSkills}
                value={selectedAdditionalSkills}
                onChange={(e, value) => setSelectedAdditionalSkills(value)}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField label="Nice to Have Skills" {...params} />
                )}
              />
            </Grid>

            <Grid item>
              <Autocomplete
                fullWidth
                options={companies}
                getOptionLabel={(option) => option?.name || ''}
                value={selectedCompany}
                onChange={(e, newValue) => setSelectedCompany(newValue)}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Company"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item>
              <Button fullWidth type="submit" variant="contained">
                Create Job
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
}
