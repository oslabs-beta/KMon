import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Chip,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';


const ConnectionDialogBox = (props) => {

  /************** Component States ****************/

  // states for port entry
  const [portIsValid, setPortIsValid] = useState(true)
  const [helperText, setHelperText] = useState(null)
  // clear hard-coded faults for production
  // form states
  const [formData, setFormData] = props.formData;
  const [portIsClicked, setPortIsClicked] = props.portIsClicked;
  const [submitting, setSubmitting] = props.submitting;
  const [open, setOpen] = props.open;
  // alert props to display in case of invalid form Input
  const [alertProps, setAlertProps] = props.alertProps;

  /************** Event Handlers *************/

  // Handle change for form input
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: Array.isArray(value) ? [...value] : value,
    }));
  };

  // TO DO: 
  // - update api URI once hosted.

  const handleSubmit = props.handleSubmit;

  const handleSubmitKey = (event) => {

    if (event.key === "Enter") {
      if (portIsClicked === true) {
        event.preventDefault();

      }
      else {
        handleSubmit(event);
      }
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // port handlers
  const ports = formData.ports;

  const handleCheckPort = (event) => {
    // Allow ports to be entered with enter or space, and check for invalid inputs
    const portNum = event.target.value;
    if (event.key === "Enter" || event.key === "Space") {

      event.preventDefault();
      if (!Number(portNum) || portNum.length < 4 || portNum.length > 5) {
        setPortIsValid(false);
        setHelperText("Invalid Port Number")
        event.target.value = null;
        return;
      }
      else if (ports.includes(portNum)) {
        setPortIsValid(false);
        setHelperText('Duplicate Port Detected')
        event.target.value = null;
        return;
      }
      else {
        setPortIsValid(true);
        const newPorts = [...ports, portNum]
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            ports: [...newPorts]
          }
        })
        setHelperText(null);
        event.target.value = null;
      };
    };

  }

  const handleDeleteChip = (event) => {
    const deleteChip = event.currentTarget.parentNode.firstChild

    const deletePort = deleteChip.innerText

    const newPorts = ports.filter((port, index) => {
      return port !== deletePort
    })
    // setPorts([...newPorts])
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        ports: [...newPorts]
      }
    })
    setHelperText(null);
    // console.log('handleCheckPort - formData: ', formData)
  }

  /******** sub-Components *******/

  // render Tags

  const portChips = ports.map((port, index) => {
    return <Chip
      id={`chip${index}`}
      key={`chip${index}`}
      label={port}
      variant='filled'
      onDelete={(e) => {
        handleDeleteChip(e);
      }}
      sx={{
        width: '100%',
        marginLeft: 0,
        marginRight: 0
      }}
    />
  })


  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        <AddIcon></AddIcon>
      </Button>
      <Dialog open={open} onClose={handleClose} onKeyDown={handleSubmitKey}>
        <DialogTitle>New Connection</DialogTitle>
        <DialogContent>
          {/* removed DialogContentText component; caused DOM content error due to div nested inside of a p element */}
          <form onSubmit={handleSubmit}>
            <Stack className='clusterStack' spacing={2} direction="row" sx={{ marginBottom: 4 }}>
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
            <Stack className='uriInputStack' spacing={2} direction="column" sx={{ marginBottom: 4 }}>
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
            {/* Check port numbers and display ports as chips */}
            <Stack className='portsInputStack' spacing={2} direction="column" sx={{ marginBottom: 4, maxWidth: 417 }}>
              <TextField
                id="ports-input"
                name="ports"
                label="Port(s):"
                variant="filled"
                onFocus={() => {
                  setPortIsClicked(true);
                }}
                onBlur={() => {
                  setPortIsClicked(false);
                }}
                error={!portIsValid}
                helperText={helperText}
                onKeyDown={handleCheckPort}
              />
              <Stack
                className="tagStack"
                spacing={2}
                direction="row"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gridAutoRows: true,
                  gridGap: '5px 2px',
                  maxWidth: '85%'
                }}>
                {portChips}
              </Stack>
            </Stack>
            <Stack className='apiStack' spacing={2} direction="row" sx={{ marginBottom: 4 }}>
              <TextField
                name="apiKey"
                // required
                id="api-key-input"
                label="API Key:"
                variant="filled"
                onChange={handleChange}
                value={formData.apiKey}
              />
              <TextField
                name="apiSecret"
                // required
                id="api-secret-input"
                label="API Secret:"
                type="password"
                variant="filled"
                onChange={handleChange}
                value={formData.apiSecret}
              />
            </Stack>
            <Button type="submit" variant="contained">Submit</Button>
            <Alert id='portAlert' severity='error' variant='outlined' sx={{ ...alertProps }}>
              {alertProps.message}
            </Alert>
          </form>
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
          <Button onClick={handleClose} onKeyDown={handleSubmitKey}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default ConnectionDialogBox;
