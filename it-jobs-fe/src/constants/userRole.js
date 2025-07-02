import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessIcon from '@mui/icons-material/Business';

export const USER_ROLE_OPTIONS = [
  { value: 'ROLE_ADMIN', label: 'Admin', icon: <PersonIcon fontSize="small" sx={{ mr: 0.5 }} /> },
  { value: 'ROLE_APPLICANT', label: 'Applicant', icon: <PersonOutlineIcon fontSize="small" sx={{ mr: 0.5 }} /> },
  { value: 'ROLE_COMPANY', label: 'Company', icon: <BusinessIcon fontSize="small" sx={{ mr: 0.5 }} /> },
];