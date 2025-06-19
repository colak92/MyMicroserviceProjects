import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { JOB_SENIORITY_OPTIONS } from "../constants/jobSeniority";

const JobSenioritySelect = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Seniority</InputLabel>
      <Select
        value={value}
        label="Seniority"
        onChange={(e) => onChange(e.target.value)}
      >
        {JOB_SENIORITY_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default JobSenioritySelect;