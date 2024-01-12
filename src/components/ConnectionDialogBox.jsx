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
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Chip,
  Alert,
  Grid,
  linearProgressClasses,
} from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';


const ConnectionDialogBox = (props) => {

  /************** Component States ****************/

  // states for port input
  const [open, setOpen] = props.open;
  const [currBrokerPort, setCurrBrokerPort] = useState('');
  const [currControllerPort, setCurrControllerPort] = useState('');
  const [brokerPortIsValid, setBrokerPortIsValid] = props.brokerPortIsValid;
  const [controllerPortIsValid, setControllerPortIsValid] = props.brokerPortIsValid;
  const [portIsClicked, setPortIsClicked] = props.portIsClicked;
  const [brokerPortHelperText, setBrokerPortHelperText] = props.brokerPortHelperText
  const [controllerPortHelperText, setControllerPortHelperText] = props.controllerPortHelperText
  // states for URI input
  const [currBrokerUri, setCurrBrokerUri] = useState('');
  const [currControllerUri, setCurrControllerUri] = useState('');
  const [uriIsClicked, setUriIsClicked] = props.uriIsClicked
  const [brokerUriIsValid, setBrokerUriIsValid] = props.brokerUriIsValid
  const [brokerUriHelperText, setBrokerUriHelperText] = props.brokerUriHelperText;
  const [controllerUriIsValid, setControllerUriIsValid] = props.brokerPortIsValid;
  const [controllerUriHelperText, setControllerUriHelperText] = props.controllerUriHelperText
  const [submitting, setSubmitting] = props.submitting;
  // state for differentiating between URI/Port inputs;
  const [controllerIsClicked, setControllerIsClicked] = useState(false);
  // form states
  const [formData, setFormData] = props.formData;
  const [dataIsFetching, setDataIsFetching] = props.dataIsFetching
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
  const seedBrokers = formData.seedBrokers;
  const controllers = formData.controllers;
  const handleSubmit = props.handleSubmit;

  const handleSubmitKey = (event) => {

    if (event.key === "Enter") {
      if (portIsClicked === true || uriIsClicked === true) {
        event.preventDefault();
      }
      else if (!seedBrokers.length) {
        setAlertProps({
          visibility: 'visible',
          marginTop: '15px',
          height: '100%',
          message: 'At least one seed broker address needed'
        })
      }
      else if (!controllers.length) {
        setAlertProps({
          visibility: 'visible',
          marginTop: '15px',
          height: '100%',
          message: 'At least one seed broker address needed'
        })
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

  // port and URI validators
  const handleCheckPort = (event) => {
    // Allow ports to be entered with enter or space, and check for invalid inputs
    const portNum = event.target.value;
    controllerIsClicked ? setCurrControllerPort(portNum) : setCurrBrokerPort(portNum)

    if (!Number(portNum) || portNum.length < 4 || portNum.length > 5) {
      if (Number(portNum) < 1028 || Number(portNum > 65535)) {
        if (controllerIsClicked) {
          setControllerPortIsValid(false);
          setControllerPortHelperText('Invalid Port Number')
          return;
        }
        else {
          setBrokerPortIsValid(false);
          setBrokerPortHelperText("Invalid Port Number")
          return;
        }
      }
    }

    if (controllerIsClicked) {
      setControllerPortIsValid(true);
      setControllerPortHelperText(null);
    }
    else {
      setBrokerPortIsValid(true);
      setBrokerPortHelperText(null);
    };
  };

  const handleCheckUri = (event) => {

    const uri = event.target.value
    controllerIsClicked ? setCurrControllerUri(uri) : setCurrBrokerUri(uri);
    const ipv4Regex = /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    const hostnameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    const isValidIP = (uri) => {
      return uri.match(hostnameRegex)?.length === 1
    }

    const isValidHostName = (uri) => {
      return uri.match(ipv4Regex)?.length === 1
    }

    if (isValidIP(uri) || isValidHostName(uri)) {
      if (controllerIsClicked) {
        setControllerUriIsValid(true);
        setControllerUriHelperText(null);
      }
      else {
        setBrokerUriIsValid(true);
        setBrokerUriHelperText(null);
      }
      return;
    }
    if (controllerIsClicked) {
      setControllerUriIsValid(false);
      setControllerUriHelperText('Enter valid URI!')
    }
    else {
      setBrokerUriIsValid(false);
      setBrokerUriHelperText('Enter valid URI!');
    }

  };
  // combine port and uri into address
  const handleSeedBroker = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (brokerPortIsValid && brokerUriIsValid) {
        // form the new seedBroker address
        const seedBroker = `${currBrokerUri}:${currBrokerPort}`;
        // check if it's already in the array of seedBrokers
        if (seedBrokers.includes(seedBroker)) {
          setAlertProps({
            visibility: 'visible',
            marginTop: '15px',
            height: '100%',
            message: 'Duplicate address detected.'
          })
          setCurrBrokerPort('');
          setCurrBrokerUri('');
          return;
        }

        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            seedBrokers: [...seedBrokers, seedBroker]
          };
        });

        setAlertProps({
          visibility: 'hidden',
          marginTop: '15px',
          height: '0',
          message: ''
        })
        setCurrBrokerPort('');
        setCurrBrokerUri('');
      };
    };
  };

  const handleController = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (controllerPortIsValid && controllerUriIsValid) {
        // form the new seedBroker address
        const controller = `${currControllerUri}:${currControllerPort}`;
        // check if it's already in the array of seedBrokers
        if (controllers.includes(controller)) {
          setAlertProps({
            visibility: 'visible',
            marginTop: '15px',
            height: '100%',
            message: 'Duplicate address detected.'
          })
          setCurrControllerPort('');
          setCurrControllerUri('');
          return;
        }

        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            controllers: [...controllers, controller]
          };
        });

        setAlertProps({
          visibility: 'hidden',
          marginTop: '15px',
          height: '0',
          message: ''
        })
        setCurrControllerPort('');
        setCurrControllerUri('');
      };
    };
  };

  const handleDeleteChip = (event) => {
    const deleteChip = event.currentTarget.parentNode.firstChild

    const deleteAddress = deleteChip.innerText
    if (controllerIsClicked) {
      const newControllers = controllers.filter((controller, index) => {
        return controller !== deleteAddress
      })
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          controllers: [...newControllers]
        }
      })
      setHelperText(null);
    }
    else {
      const newSeedBrokers = seedBrokers.filter((broker, index) => {
        return broker !== deleteBroker
      })
      setFormData((prevFormData) => {
        return {
          ...prevFormData,
          seedBrokers: [...newSeedBrokers]
        }
      })
      setHelperText(null);
    }
  }

  /******** sub-Components *******/

  // render address Tags
  const brokerChips = seedBrokers.map((broker, index) => {
    return (
      <Grid key={`brokerGridItem${index}`}>
        <Chip
          id={`chip${index}`}
          key={`broker${index}`}
          label={broker}
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
      </Grid>
    );
  });

  const controllerChips = controllers.map((controller, index) => {
    return (
      <Grid key={`controllerGridItem${index}`}>
        <Chip
          id={`chip${index}`}
          key={`controller${index}`}
          label={controller}
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
      </Grid>
    );
  });

  const loadingBar = () => {
    return (
      <Stack >
        <LinearProgress id="loadingBar" />
      </Stack>
    );
  };

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
            <Stack className='addressInputStack' spacing={2} direction="row" sx={{
              marginBottom: 4,
              maxWidth: 417,
            }}>
              <TextField
                id="cUri-input"
                name="controllerURI"
                label="Kafka Controller URI:"
                variant="filled"
                sx={{
                  flexGrow: 3,
                  width: "75%"
                }}
                onFocus={() => {
                  setUriIsClicked(true);
                  setControllerIsClicked(true);
                }}
                onBlur={() => {
                  setUriIsClicked(false);
                }}
                error={!controllerUriIsValid}
                helperText={controllerUriHelperText}
                onChange={handleCheckUri}
                value={currControllerUri}
                onKeyDown={handleController}
              />
              <TextField
                id="controllerPorts-input"
                name="controllerPort"
                label="Port:"
                variant="filled"
                sx={{
                  flexGrow: 1,
                  width: "25%"
                }}
                onFocus={() => {
                  setPortIsClicked(true);
                  setControllerIsClicked(true);
                }}
                onBlur={() => {
                  setPortIsClicked(false);
                }}
                error={!controllerPortIsValid}
                helperText={controllerPortHelperText}
                onChange={handleCheckPort}
                value={currControllerPort}
                onKeyDown={handleController}
              />
            </Stack>
            <Grid
              container
              key='controllerTagGrid'
              className="tagGrid"
              spacing={2}
              direction="row"
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridAutoRows: true,
                gridGap: '2px',
                maxWidth: '417px',
                marginLeft: 0,
                marginBottom: '10px'
              }}>
              {controllerChips}
            </Grid>
            <Stack className='addressInputStack' spacing={2} direction="row" sx={{
              marginBottom: 4,
              maxWidth: 417,
            }}>
              <TextField
                id="uri-input"
                name="serverURI"
                label="Kafka Seed Broker URI:"
                variant="filled"
                sx={{
                  flexGrow: 3,
                  width: "75%"
                }}
                onFocus={() => {
                  setUriIsClicked(true);
                  setControllerIsClicked(false);
                }}
                onBlur={() => {
                  setUriIsClicked(false);
                }}
                error={!brokerUriIsValid}
                helperText={brokerUriHelperText}
                onChange={handleCheckUri}
                value={currBrokerUri}
                onKeyDown={handleSeedBroker}
              />
              <TextField
                id="brokerPort-input"
                name="brokerPort"
                label="Port:"
                variant="filled"
                sx={{
                  flexGrow: 1,
                  width: "25%"
                }}
                onFocus={() => {
                  setPortIsClicked(true);
                  setControllerIsClicked(false);
                }}
                onBlur={() => {
                  setPortIsClicked(false);
                }}
                error={!brokerPortIsValid}
                helperText={brokerPortHelperText}
                onChange={handleCheckPort}
                value={currBrokerPort}
                onKeyDown={handleSeedBroker}
              />
            </Stack>
            <Grid
              container
              key='tagGrid'
              className="tagGrid"
              spacing={2}
              direction="row"
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridAutoRows: true,
                gridGap: '2px',
                maxWidth: '417px',
                marginLeft: 0,
                marginBottom: '10px'
              }}>
              {brokerChips}
            </Grid>
            <Stack className='apiStack' spacing={2} direction="column" sx={{ marginBottom: 4 }}>
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

            {dataIsFetching && loadingBar()}

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
