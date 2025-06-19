import React, { useState } from 'react';
import { Button, TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import { register } from '../../ReduxToolkit/AuthSlice';
import { USER_ROLE_OPTIONS } from '../../constants/userRole';

const Signup = ({ togglePanel }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(register(formData));
    console.log('Login form', formData);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 className="text-lg font-bold text-center pb-8" style={{ color: '#4d7fd0' }}>Register</h1>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Box display="flex" flexDirection="column" gap={2}>
           <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your fullName..."
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email..."
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password..."
            required
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              {USER_ROLE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
        </FormControl>
          <div>
          <Button
            fullWidth
            type="submit"
            sx={{
              padding: '.9rem',
              backgroundColor: '#4d7fd0',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: 1,
              boxShadow: '0 4px 15px rgba(140, 190, 255, 0.5)',
              '&:hover': {
                backgroundColor: '#3a5cb1',
                boxShadow: '0 6px 20px rgba(58, 90, 177, 0.6)',
              },
            }}
          >
            Register
          </Button>
          </div>
        </Box>
      </form>
      <div className='mt-5 flex items-center gap-2 py-5 justify-center'>
        <span>
            I already have an account.
        </span>
        <Button onClick={() => togglePanel()}>Sign In</Button>
      </div>
    </div>
  );
};

export default Signup;