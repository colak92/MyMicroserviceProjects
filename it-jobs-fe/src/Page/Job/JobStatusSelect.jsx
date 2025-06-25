import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { JOB_STATUS_OPTIONS } from '../../constants/jobStatus';

const JobStatusSelect = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Status</InputLabel>
      <Select
        value={value}
        label="Status"
        onChange={(e) => onChange(e.target.value)}
      >
        {JOB_STATUS_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default JobStatusSelect;
