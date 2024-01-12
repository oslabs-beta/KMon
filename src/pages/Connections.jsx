import React from 'react';
import { useState, useEffect } from 'react';
import ConnectionsTable from '../components/ConnectionsTable.jsx';
import ConnectionDialogBox from '../components/ConnectionDialogBox.jsx';
import { Container } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from "../AppContext";


// TO DO: confirm apiUrl for production
const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.kmon.com'
    : 'http://localhost:3010';


const Connections = () => {
  const theme = useTheme();

  const { userInfo, updateUserInfo } = useAppContext();

  // Took out the optional operator after thinking about it -- Accessing the connections page without userInfo may mean the app is being used without authorization; better that it throws an error and the app goes blank if userInfo is not defined
  const userID = userInfo.userID;


  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  // State for child components;
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [brokerPortIsValid, setBrokerPortIsValid] = useState(true);
  const [controllerPortIsValid, setControllerPortIsValid] = useState(true);
  const [portIsClicked, setPortIsClicked] = useState(false);
  const [brokerPortHelperText, setBrokerPortHelperText] = useState(null);
  const [controllerPortHelperText, setControllerPortHelperText] = useState(null);

  const [brokerUriIsValid, setBrokerUriIsValid] = useState(true);
  const [controllerUriIsValid, setControllerUriIsValid] = useState(true);
  const [uriIsClicked, setUriIsClicked] = useState(false);
  const [brokerUriHelperText, setBrokerUriHelperText] = useState(null);
  const [controllerUriHelperText, setControllerUriHelperText] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dataIsFetching, setDataIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    clusterName: '',
    controllers: [],
    seedBrokers: [],
    apiKey: '',
    apiSecret: '',
  });
  const [alertProps, setAlertProps] = useState({
    visibility: 'hidden',
    height: 0,
    message: ''
  });

  // function for fetching connections from database.
  const loadConnections = async () => {
    const response = await fetch(`${apiUrl}/api/getConnections/${userID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json();

    const connectionData = data.map((obj) => {
      return {
        id: obj.cluster_id,
        name: obj.cluster_name,
        controllers: obj.controllers,
        brokers: obj.brokers,
        created: obj.created_on
      }
    })
    setRows([...connectionData])
  }

  // useEffect to render saved connections upon first load;
  useEffect(() => {
    loadConnections();
  }, [])

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!portIsClicked) {
      // check if form is valid, otherwise display alert.
      if (!formData.clusterName || !formData.seedBrokers.length) {
        setAlertProps({
          visibility: 'visible',
          marginTop: '15px',
          height: '100%',
          message: 'Please provide cluster name and seed broker URIs.'
        })
      }
      else
        try {
          //find new ID from rows;
          const getNewId = (rows) => {
            let maxId = 0;
            for (let row of rows) {
              if (row.id > maxId) maxId = row.id
            }
            return maxId + 1;
          }
          // local variables
          const id = getNewId(rows)
          const { clusterName, controllers, seedBrokers, apiKey, apiSecret } = formData;
          const currDateStr = new Date();
          const [month, date, year] = [currDateStr.getMonth(), currDateStr.getDate(), currDateStr.getFullYear().toString().slice(2)]
          const createdDate = `${month + 1}/${date}/${year}`

          for (let row of rows) {
            for (let broker of row.brokers) {
              if (seedBrokers.includes(broker)) {
                setAlertProps({
                  visibility: 'visible',
                  marginTop: '15px',
                  height: '100%',
                  message: 'Duplicate found in existing connections!'
                })
                throw new Error('Duplicate connection detected')
              };
            };

            for (let controller of row.controllers) {
              if (controllers.includes(controller)) {
                setAlertProps({
                  visibility: 'visible',
                  marginTop: '15px',
                  height: '100%',
                  message: 'Duplicate found in existing connections!'
                })
                throw new Error('Duplicate connection detected')
              };
            };

          };

          const newDbEntry = {
            id: id,
            name: clusterName,
            controllers: controllers,
            seedBrokers: seedBrokers,
            created: createdDate,
            apiKey: apiKey,
            apiSecret: apiSecret
          }

          // console.log("about to create config yamls")
          setDataIsFetching(true);

          const response = await fetch(`${apiUrl}/api/createConnection`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...newDbEntry,
              userID
            }),
          });

          const data = await response.json();

          const newRow = {
            id: id,
            name: clusterName,
            controllers: controllers,
            brokers: data,
            created: createdDate
          }
          // console.log('Connections - data: ', data);

          // Logic for creating new row when a server information is inputted and processed in back end.
          if (response.ok) {

            setDataIsFetching(false);

            const currRows = [...rows];
            currRows.push(newRow);
            setRows(currRows);

            setSubmitting(false);
            setFormData({
              clusterName: '',
              controllers: [],
              seedBrokers: [],
              apiKey: '',
              apiSecret: '',
            });

            setAlertProps({
              visibility: 'hidden',
              marginTop: '15px',
              height: '0',
              message: ''
            });

            loadConnections();
            setOpen(false)

          } else {
            setDataIsFetching(false);
            setAlertProps({
              visibility: 'visible',
              marginTop: '15px',
              height: '100%',
              message: 'Error while creating connections!'
            })
            console.error('Failed to save credentials');
          }
        } catch (error) {
          console.error('Error in Credential Form: ', error);
        }
    }
  };

  const handleDelete = async (event) => {
    // console.log(event.target);
    // console.log(selected);

    try {
      const deleteInfo = {
        userid: userID,
        clusters: selected
      }
      const response = await fetch(`${apiUrl}/api/deleteConnections`, {
        method: 'DELETE',
        headers: {
          'CONTENT-TYPE': 'application/json'
        },
        body: JSON.stringify(deleteInfo)
      })

      const responseData = await response.json();

      console.log('Connections.jsx - responseData: ', responseData);

      loadConnections();
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <Container sx={containerStyle}>
      <div>
        <h1>Saved Connections</h1>
        <ConnectionDialogBox open={[open, setOpen]} portIsClicked={[portIsClicked, setPortIsClicked]} brokerPortIsValid={[brokerPortIsValid, setBrokerPortIsValid]} controllerPortIsValid={[controllerPortIsValid, setControllerPortIsValid]} brokerPortHelperText={[brokerPortHelperText, setBrokerPortHelperText]} controllerPortHelperText={[controllerPortHelperText, setControllerPortHelperText]} uriIsClicked={[uriIsClicked, setUriIsClicked]} brokerUriIsValid={[brokerUriIsValid, setBrokerUriIsValid]} controllerUriIsValid={[controllerUriIsValid, setControllerPortIsValid]} brokerUriHelperText={[brokerUriHelperText, setBrokerUriHelperText]} controllerUriHelperText={[controllerUriHelperText, setControllerUriHelperText]} submitting={[submitting, setSubmitting]} dataIsFetching={[dataIsFetching, setDataIsFetching]} formData={[formData, setFormData]} handleSubmit={handleSubmit} alertProps={[alertProps, setAlertProps]} />
      </div>
      <ConnectionsTable rows={[rows, setRows]} selected={[selected, setSelected]} handleDelete={handleDelete} />
    </Container>
  );
};

export default Connections;
