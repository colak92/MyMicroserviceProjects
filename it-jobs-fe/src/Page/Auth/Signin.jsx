import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../../ReduxToolkit/AuthSlice';

const Signin = ({ togglePanel }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(formData));
    console.log('Login form', formData);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 className="text-lg font-bold text-center pb-8" style={{ color: '#4d7fd0' }}>Login</h1>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Box display="flex" flexDirection="column" gap={2}>
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
            Login
          </Button>
        </Box>
      </form>
      <div/>
      <div style={{ marginTop: '10px' }}>
        <span>
            Don't have an account?
        </span>
        <Button onClick={() => togglePanel()} style={{ marginLeft: '10px' }}>Sign Up</Button>
      </div>
    </div>
  );
};

export default Signin;