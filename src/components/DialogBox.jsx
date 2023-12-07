import * as React from 'react';
// import { appContext } from './App';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

export default function MaxWidthDialog() {
  // unpack state 
  // const {
  //   state: { connectionState, appState }, actions: { setConnectionState, setAppState },
  // } = useContext(appContext);
  //   const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = React.useState({
    serverURI: '',
    apiKey: '', 
    apiSecret: '', 
  });
  // handle change for form input
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
  }

    // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/createConnection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serverURI: formData.serverURI,
          apiKey: formData.apiKey,
          apiSecret: formData.apiSecret,
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        // setAppState((prevState) => {
        //   return {...prevState, kafkaTopics: data, sidebarTab: true};
        // })
      } else {
        console.log('Failed to save credentials');
      }
    } catch (error) {
      console.log('Error in CredentialForm: ', error);
    } finally {
      setSubmitting(false);
      setFormData({ serverURI: '', apiKey: '', apiSecret: '' });
    }
  }  

  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create a new connection
      </Button>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>New Connection</DialogTitle>
        <DialogContent>
          <DialogContentText>
                      <form onSubmit={handleSubmit}>
                        <TextField
                          id="uri-input"
                          name="serverURI"
                          required
                          label="Kafka Server URI:"
                          variant="filled"
                          onChange={handleChange}
                          value={formData.serverURI}
                        />
                        <TextField
                          name="apiKey"
                          required
                          id="api-key-input"
                          label="API Key:"
                          variant="filled"
                          onChange={handleChange}
                          value={formData.apiKey}
                        />
                        <TextField
                          name="apiSecret"
                          required
                          id="api-secret-input"
                          label="API Secret:"
                          type="password"
                          variant="filled"
                          onChange={handleChange}
                          value={formData.apiSecret}
                        />
                        <button type="submit">Submit</button>
                      </form>
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
