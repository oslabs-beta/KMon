import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import validator from 'validator';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.kmon.com'
    : 'http://localhost:3010';

function SignUp() {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px',
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [validateErrorMessage, setValidateErrorMessage] = useState('');
  const [passMatch, setPassMatch] = useState(true);

  useEffect(() => {
    confirmPasswordMatch();
  }, [formData]);

  const confirmPasswordMatch = () => {
    formData.password === formData.confirmPassword
      ? setPassMatch(true)
      : setPassMatch(false);
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    validatePassword();

    try {
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_email: formData.email,
          user_password: formData.password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        navigate('/overview');
      }
    } catch (error) {
      console.log('Error in LogIn Form: ', error);
    } finally {
      setSubmitting(false);
      setFormData((prevData) => ({
        ...prevData,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === 'password') {
      validatePassword(value);
      confirmPasswordMatch();
    } else if (name === 'confirmPassword') {
      confirmPasswordMatch();
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setValidateErrorMessage('Password cannot be empty');
    } else if (validator.isStrongPassword(value, { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
      setValidateErrorMessage('Is Strong Password');
    } else {
      setValidateErrorMessage('Create a strong password with a mix of letters, numbers, and symbols');
    }
  };  

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={containerStyle}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create a KMon Account
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="last-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                  <Typography
                      variant="body2"
                  >
                      {validateErrorMessage}
                  </Typography>
              </Grid>
              <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                className={`form-control ${passMatch ? '' : 'input-error-border'}`}
                error={!passMatch}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <Typography variant="body2">
                {formData.confirmPassword !== '' && (
                  <>
                    <div className={`input-error ${passMatch ? 'success-message' : 'error-message'}`}>
                      {passMatch ? 'Passwords match.' : 'Those passwords didn’t match. Try again.'}
                    </div>
                  </>
                )}
              </Typography>
            </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <RouterLink to="/login">
                  Already have an account? Sign in
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
