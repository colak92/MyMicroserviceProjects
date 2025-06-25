import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { JOB_APPLICATION_STATUS_OPTIONS } from '../../constants/jobApplicationStatus';

const JobApplicationStatusSelect = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Status</InputLabel>
      <Select
        value={value}
        label="Status"
        onChange={(e) => onChange(e.target.value)}
      >
        {JOB_APPLICATION_STATUS_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default JobApplicationStatusSelect;
