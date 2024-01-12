// SignUp.js
// This component handles user sign-up functionality, including form validation and API calls.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import validator from 'validator';
import {
  Alert,
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

// TO DO: confirm apiUrl for production
// API URL setup based on the environment
const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.kmon.com'
    : 'http://localhost:3010';

function SignUp(props) {
  const containerStyle = {
    marginLeft: 'auto',
    marginTop: 'auto',
  };

  const navigate = useNavigate();

  // Destructuring onLogin from props for login status management
  const { onLogin } = props;

  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [validateErrorMessage, setValidateErrorMessage] = useState('');
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [passMatch, setPassMatch] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Handle change for form input fields
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

  // Check if Password and Confirm Password fields match
  const confirmPasswordMatch = () => {
    formData.password === formData.confirmPassword
      ? setPassMatch(true)
      : setPassMatch(false);
  };

  // Whenever formData changes, re-execute the confirmPasswordMatch function
  useEffect(() => {
    confirmPasswordMatch();
  }, [formData]);

  useEffect(() => {
    setEmailErrorMessage('');
  }, [formData.email]);

  // Validate password strength and set error message
  const validatePassword = (value) => {
    if (!value) {
      setValidateErrorMessage('Password cannot be empty');
      return false;
    } else if (
      validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
    ) {
      return true;
    } else {
      setValidateErrorMessage(
        'Password must be at least 8 characters including a lowercase letter, an uppercase letter, and a number.'
      );
      return false;
    }
  };

  // Ensure valid submission and handle sign-up using POST API call
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setApiErrorMessage('');

    // If invalid email, set isError and the email error message
    if (!validator.isEmail(formData.email)) {
      setIsError(true);
      setEmailErrorMessage('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // If invalid password, set isError and the validate error message
    if (!validatePassword(formData.password) || passMatch === false) {
      setIsError(true);
      setValidateErrorMessage('Invalid password');
      setIsSubmitting(false);
      return;
    }

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
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          // console.log('Signup successful. Navigating to /Overview...');
          onLogin();
          navigate('/Connections');
        }
      } else {
        const data = await response.json();
        setIsError(true);
        // console.log('Sign up failed. Status:', response.status);
        // console.log('Server Response:', data);
        setApiErrorMessage('Account with this email already exists.');
      }
    } catch (error) {
      setIsError(true);
      // Log any errors that occur during the signup process
      // console.log('Error in Signup Form: ', error);
    } finally {
      // Reset form data after submission
      setIsSubmitting(false);
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

  // MUI Theme setup
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
                <Typography variant="body2">{emailErrorMessage}</Typography>
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
                <Typography variant="body2">{validateErrorMessage}</Typography>
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
                  className={`form-control ${
                    passMatch ? '' : 'input-error-border'
                  }`}
                  error={!passMatch}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <Typography variant="body2">
                  {/* If confirm password field is not empty, then provide feedback on whether passwords match or not */}
                  {formData.confirmPassword !== '' && (
                    <>
                      <div
                        className={`input-error ${
                          passMatch ? 'success-message' : 'error-message'
                        }`}
                      >
                        {passMatch
                          ? 'Passwords match.'
                          : 'Those passwords didn’t match. Try again.'}
                      </div>
                    </>
                  )}
                </Typography>
                {/* Conditional rendering of invalid signup error message */}
                {isError ? (
                  <Alert severity="error" sx={{ marginTop: '10px' }}>
                    {apiErrorMessage ||
                      emailErrorMessage ||
                      validateErrorMessage}
                  </Alert>
                ) : null}
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
