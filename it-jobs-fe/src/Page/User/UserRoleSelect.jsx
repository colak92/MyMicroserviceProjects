import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { USER_ROLE_OPTIONS } from "../../constants/userRole";

const UserRoleSelect = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Role</InputLabel>
      <Select
        value={value}
        label="Role"
        onChange={(e) => onChange(e.target.value)}
      >
        {USER_ROLE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default UserRoleSelect;