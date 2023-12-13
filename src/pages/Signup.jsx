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

function SignUp(props) {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px',
  };

  const { onLogin } = props;

  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [validateErrorMessage, setValidateErrorMessage] = useState('');
  const [passMatch, setPassMatch] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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
    setIsSubmitting(true);
    
    if (!validator.isEmail(formData.email)) {
      setIsError(true);
      setEmailErrorMessage('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setIsError(true);
      setValidateErrorMessage('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }
    
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
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Signup successful. Navigating to /Overview...');
          onLogin();
          navigate('/Overview');
      } else {
        // The response does not contain valid JSON
        console.log('Unexpected response format. Status:', response.status);
      } 
    } else {
      setIsError(true);
      console.log('Sign up failed. Status:', response.status);
    }
    } catch (error) {
      console.log('Error in Signup Form: ', error);
    } finally {
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
    } else if (validator.isStrongPassword(value, { minLength: 6, minNumbers: 1, minSymbols: 1 })) {
      setValidateErrorMessage('Is Strong Password');
    } else if (value.length < 6) {
      setValidateErrorMessage('Password must be at least 6 characters long');
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
                  <Typography
                      variant="body2"
                  >
                      {emailErrorMessage}
                  </Typography>
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