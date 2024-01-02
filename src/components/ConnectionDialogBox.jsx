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

  // states for port entry

  /********** Need to refactor "port is clicked" and "port is valid" states to reflect changes to connection handling **********/
  const [open, setOpen] = props.open;
  const [currPort, setCurrPort] = useState('');
  const [portIsValid, setPortIsValid] = props.portIsValid;
  const [portIsClicked, setPortIsClicked] = props.portIsClicked;
  const [portHelperText, setPortHelperText] = props.portHelperText

  const [currUri, setCurrUri] = useState('');
  const [uriIsClicked, setUriIsClicked] = props.uriIsClicked
  const [uriIsValid, setUriIsValid] = props.uriIsValid
  const [uriHelperText, setUriHelperText] = props.uriHelperText
  const [submitting, setSubmitting] = props.submitting;
  // clear hard-coded faults for production
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



  /**********  Could potentially only provide one or two seed brokers and utilize kafkaJS to automatically discover other ports... **********/
  const handleCheckPort = (event) => {
    // Allow ports to be entered with enter or space, and check for invalid inputs
    const portNum = event.target.value;
    setCurrPort(portNum)
    console.log('checkPort - portNum: ', portNum);
    if (!Number(portNum) || portNum.length < 4 || portNum.length > 5) {
      if (Number(portNum) < 1028 || Number(portNum > 65535)) {
        setPortIsValid(false);
        setPortHelperText("Invalid Port Number")
        return;
      }
    }
    else {
      setPortIsValid(true);
      setPortHelperText(null);
    };
  };

  const handleCheckUri = (event) => {

    const uri = event.target.value
    setCurrUri(uri);
    const ipv4Regex = /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/
    const hostnameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    console.log('handleCheckUri - uri: ', uri);

    const isValidIP = (uri) => {
      return uri.match(hostnameRegex)?.length === 1
    }

    const isValidHostName = (uri) => {
      return uri.match(ipv4Regex)?.length === 1
    }

    const handleError = (uri) => {

      if (!uri.match(ipv4Regex) && !uri.match(hostnameRegex)) {
        // console.error('no match', uri.match(ipv4Regex), uri.match(hostnameRegex))
        setUriIsValid(false);
        setUriHelperText('Enter valid URI!');
      }
      else if (uri.match(ipv4Regex)?.length > 1) {
        // console.error('too many matches', uri.match(ipv4Regex), uri.match(hostnameRegex))
        setUriIsValid(false);
        setUriHelperText('Input one address at a time');
      }
      else if (uri.match(hostnameRegex)?.length > 1) {
        // console.error('too many matches', uri.match(ipv4Regex), uri.match(hostnameRegex))
        setUriIsValid(false);
        setUriHelperText('Input one address at a time');
      }

    }

    if (isValidIP(uri) || isValidHostName(uri)) {
      setUriIsValid(true);
      setUriHelperText(null);
      return;
    }

    handleError(uri);

  };



  const handleSeedBroker = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (portIsValid && uriIsValid) {
        // form the new seedBroker address
        const seedBroker = `${currUri}:${currPort}`;
        // check if it's already in the array of seedBrokers
        if (seedBrokers.includes(seedBroker)) {
          setAlertProps({
            visibility: 'visible',
            marginTop: '15px',
            height: '100%',
            message: 'Duplicate address detected.'
          })
          setCurrPort('');
          setCurrUri('');
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
        setCurrPort('');
        setCurrUri('');
      };
    };
  };

  /**********  Need to deleteChip to reflect URI:PORT combinations. **********/

  const handleDeleteChip = (event) => {
    const deleteChip = event.currentTarget.parentNode.firstChild

    const deleteBroker = deleteChip.innerText

    const newSeedBrokers = seedBrokers.filter((broker, index) => {
      return broker !== deleteBroker
    })
    // setPorts([...newPorts])
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        seedBrokers: [...newSeedBrokers]
      }
    })
    setHelperText(null);
    // console.log('handleCheckPort - formData: ', formData)
  }

  /******** sub-Components *******/

  // render Tags

  const brokerChips = seedBrokers.map((broker, index) => {
    return (
      <Grid>
        <Chip
          id={`chip${index}`}
          key={`chip${index}`}
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

  const loadingBar = () => {
    return <linearProgress id="loadingBar" />;
  }

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
                }}
                onBlur={() => {
                  setUriIsClicked(false);
                }}
                error={!uriIsValid}
                helperText={uriHelperText}
                onChange={handleCheckUri}
                value={currUri}
                onKeyDown={handleSeedBroker}
              />
              <TextField
                id="ports-input"
                name="port"
                label="Port:"
                variant="filled"
                sx={{
                  flexGrow: 1,
                  width: "25%"
                }}
                onFocus={() => {
                  setPortIsClicked(true);
                }}
                onBlur={() => {
                  setPortIsClicked(false);
                }}
                error={!portIsValid}
                helperText={portHelperText}
                onChange={handleCheckPort}
                value={currPort}
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
