import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { COMPANY_STATUS_OPTIONS } from "../../constants/companyStatus";

const CompanyStatusSelect = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Status</InputLabel>
      <Select
        value={value}
        label="Status"
        onChange={(e) => onChange(e.target.value)}
      >
        {COMPANY_STATUS_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CompanyStatusSelect;