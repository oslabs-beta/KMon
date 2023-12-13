import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import validator from 'validator';
import {
  Avatar,
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { createTheme, ThemeProvider } from '@mui/material/styles';

// import GoogleSignIn from './GoogleSignIn.jsx';

import loginImage from '../../assets/splash-art-gradient.jpeg';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.kmon.com'
    : 'http://localhost:3010';

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit">KMon</Link> {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const LogIn = (props) => {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px',
  };

  const { onLogin } = props;
  const navigate = useNavigate();

  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validateErrorMessage, setValidateErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // handle change for form input
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isValidLoginSubmission = (email, password) => {
    const isValidEmail = validator.isEmail(email);
    const isValidPassword = password.trim().length > 0;
  
    return {
      isValid: isValidEmail && isValidPassword,
      isValidEmail,
      isValidPassword,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const validation = isValidLoginSubmission(formData.email, formData.password);

    if (!validation.isValid) {
      let errorMessage = 'Enter ';
      if (!validation.isValidEmail) {
        errorMessage += 'an email';
        if (!validation.isValidPassword) {
          errorMessage += ' and password';
        }
      }
      else if (!validation.isValidPassword) {
        errorMessage = 'Enter a password';
      }
  
      setValidateErrorMessage(errorMessage + '.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          user_email: formData.email,
          user_password: formData.password,
        }),
      });
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Login successful. Navigating to /Overview...');
          onLogin();
          navigate('/Overview');
        } else {
          // The response does not contain valid JSON
          console.log('Unexpected response format. Status:', response.status);
        }
      } else {
        setIsError(true);
        console.log('Login failed. Status:', response.status);
      }
    } catch (error) {
      setIsError(true);
      console.log('Error in LogIn Form: ', error);
    } finally {
      setIsSubmitting(false);
      setValidateErrorMessage('')
      setFormData((prevData) => ({
        ...prevData,
        email: '',
        password: '',
      }));
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="100%" sx={containerStyle}>
        <CssBaseline />
        <Grid
          container
          component="main"
          sx={{ height: '100vh', width: '100%' }}
        >
          <Grid
            item
            xs={false}
            sm={6}
            md={7}
            sx={{
              backgroundImage: `url(${loginImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid
            item
            xs={12}
            sm={6}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                margin: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  autoFocus
                />
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel size="small" sx={{ width: '100%' }}>
                    Password
                  </InputLabel>
                  <OutlinedInput
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Log In
                </Button>
                {validateErrorMessage && (
                      <Typography variant="body2">
                        {validateErrorMessage}
                      </Typography>
                    )}
                <Typography component="h1" variant="h5">
                  
                  ----------------------------------
                </Typography>

                {/* <GoogleSignIn /> */}

                <Typography component="h1" variant="h5">
                  ----------------------------------
                </Typography>

                {isError ? (
                  <Alert severity="error" sx={{ marginTop: '10px' }}>
                    Email or password is incorrect
                  </Alert>
                ) : null}

                <Grid container>
                  <Grid item xs>
                    {/* <RouterLink to="/forgot">
                      Forgot password?
                    </RouterLink> */}
                  </Grid>
                  <Grid item>
                    <RouterLink to="/signup">
                      {"Don't have an account? Sign up"}
                    </RouterLink>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default LogIn;