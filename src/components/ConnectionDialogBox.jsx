import * as React from 'react';
// import { appContext } from './App';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ConnectionDialogBox = () => {
  // unpack state
  // const {
  //   state: { connectionState, appState }, actions: { setConnectionState, setAppState },
  // } = useContext(appContext);
  //   const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = React.useState({
    clusterName: '',
    serverURI: '',
    apiKey: '',
    apiSecret: '',
  });
  // handle change for form input
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/createConnection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clusterName: formData.clusterName,
          serverURI: formData.serverURI,
          apiKey: formData.apiKey,
          apiSecret: formData.apiSecret,
        }),
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
      setFormData({
        clusterName: '',
        serverURI: '',
        apiKey: '',
        apiSecret: '',
      });
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        <AddIcon></AddIcon>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Connection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                <TextField
                  id="cluster-name"
                  name="clusterName"
                  required
                  label="Cluster Name:"
                  variant="filled"
                  onChange={handleChange}
                  value={formData.clusterName}
                />
              </Stack>
              <Stack spacing={2} direction="column" sx={{ marginBottom: 4 }}>
                <TextField
                  id="uri-input"
                  name="serverURI"
                  required
                  label="Kafka Server URI:"
                  variant="filled"
                  onChange={handleChange}
                  value={formData.serverURI}
                />
              </Stack>
              <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
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
              </Stack>
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
          ></Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ConnectionDialogBox;
