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


// TO DO: confirm apiUrl for production
const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.kmon.com'
    : 'http://localhost:3010';


const ConnectionDialogBox = () => {

  /************** Component States ****************/

  // states for port entry
  const [portIsClicked, setPortIsClicked] = useState(false);
  const [portIsValid, setPortIsValid] = useState(true)
  const [helperText, setHelperText] = useState(null)
  // clear hard-coded faults for production
  // const [ports, setPorts] = useState(['1234', '2345', '3456']);
  // form states
  const [submitting, setSubmitting] = useState(false);
  // clear hard-coded formData for production;
  const [formData, setFormData] = useState({
    clusterName: 'Demo',
    serverURI: '192.168.10.85',
    ports: ['8997', '8998', '8999'],
    apiKey: '',
    apiSecret: '',
  });
  const [open, setOpen] = useState(false);
  // alert props to display in case of invalid form Input
  const [alertProps, setAlertProps] = useState({
    visibility: 'hidden',
    height: 0,
    message: ''
  })


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
  // - update api call
  // - need to fix up ports input event handlers. Currently, clicking "enter" with a valid port updates port numbers in state but also serves sets the state for "portIsValid" to false, which changes the appearance of the input box.
  const handleSubmit = async (event) => {
    console.log(portIsClicked);
    event.preventDefault();
    if (!portIsClicked) {
      // check if form is valid, otherwise display alert.
      if (!formData.clusterName || !formData.serverURI || !formData.ports.length) {
        setAlertProps({
          visibility: 'visible',
          marginTop: '15px',
          height: '100%',
          message: 'Please provide cluster name, server URI, and port numbers'
        })
      }
      else
        try {
          const response = await fetch(`${apiUrl}/api/createConnection`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData
            }),
          });
          console.log(response);

          if (response.ok) {
            const data = await response.json();
            setSubmitting(false);
            setFormData({
              clusterName: '',
              serverURI: '',
              ports: [],
              apiKey: '',
              apiSecret: '',
            });
            console.log('data submitted! data: ', data)
          } else {
            console.log('Failed to save credentials');
          }
        } catch (error) {
          console.log('Error in Credential Form: ', error);
        } finally {
          setSubmitting(false);
          setFormData({
            clusterName: '',
            serverURI: '',
            ports: [],
            apiKey: '',
            apiSecret: '',
          });
        }
    }
    else {
      event.preventDefault();
    }
  };

  const handleSubmitKey = (event) => {

    if (event.key === "Enter") {
      if (portIsClicked === true) {
        event.preventDefault();
        handleCheckPort(event);
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
  // console.log('port handlers - ports.map: ', ports.map);
  const handleCheckPort = (event) => {
    // Allow ports to be entered with enter or space, and check for invalid inputs

    const portNum = event.target.value;
    if (event.key === "Enter" || event.key === "Space") {

      event.preventDefault();
      if (!Number(portNum) || portNum.length < 4 || portNum.length > 5) {
        setPortIsValid(false);
        setHelperText("Invalid Port Number")
        event.target.value = null;
      }
      else if (ports.includes(portNum)) {
        setPortIsValid(false);
        setHelperText('Duplicate Port Detected')
        event.target.value = null;
      }
      else {
        setPortIsValid(true);
        // setPorts((prevState) => {
        //   return [...prevState, portNum];
        // })
        console.log('event target name in checkPort: ', event.target.name)
        console.log('event target value in checkPort: ', event.target.value)
        const newPorts = [...ports, portNum]
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            ports: [...newPorts]
          }
        })
        setHelperText(null);
        event.target.value = null;
      }
    }

    console.log('handleCheckPort - formData: ', formData)

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
    console.log('handleCheckPort - formData: ', formData)
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
