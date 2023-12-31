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

  // Using optional chaining operator to prevent errors when accessing property that might be undefined or null
  const userID = userInfo?.userID;

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  // State for child components;
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [portIsValid, setPortIsValid] = useState(true);
  const [portIsClicked, setPortIsClicked] = useState(false);
  const [portHelperText, setportHelperText] = useState(null);

  const [uriIsValid, setUriIsValid] = useState(true);
  const [uriIsClicked, setUriIsClicked] = useState(false);
  const [uriHelperText, setUriHelperText] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clusterName: '',
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
        seedBrokers: obj.seed_brokers,
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
          const { clusterName, seedBrokers } = formData;
          const currDateStr = new Date();
          const [month, date, year] = [currDateStr.getMonth(), currDateStr.getDate(), currDateStr.getFullYear().toString().slice(2)]
          const createdDate = `${month}/${date}/${year}`

          const newRow = {
            id: id,
            name: clusterName,
            seedBrokers: seedBrokers,
            created: createdDate
          }

          for (let row of rows) {
            for (let broker of row.seedBrokers) {
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
          };
          // console.log("about to create config yamls")
          const response = await fetch(`${apiUrl}/api/createConnection`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...newRow,
              userID
            }),
          });

          // Logic for creating new row when a server information is inputted and processed in back end.
          if (response.ok) {
            const currRows = [...rows];
            currRows.push(newRow);
            setRows(currRows);

            setSubmitting(false);
            setFormData({
              clusterName: '',
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
            console.log('Failed to save credentials');
          }
        } catch (error) {
          console.log('Error in Credential Form: ', error);
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
        <ConnectionDialogBox open={[open, setOpen]} portIsClicked={[portIsClicked, setPortIsClicked]} portIsValid={[portIsValid, setPortIsValid]} portHelperText={[portHelperText, setportHelperText]} uriIsClicked={[uriIsClicked, setUriIsClicked]} uriIsValid={[uriIsValid, setUriIsValid]} uriHelperText={[uriHelperText, setUriHelperText]} submitting={[submitting, setSubmitting]} formData={[formData, setFormData]} handleSubmit={handleSubmit} alertProps={[alertProps, setAlertProps]} />
      </div>
      <ConnectionsTable rows={[rows, setRows]} selected={[selected, setSelected]} handleDelete={handleDelete} />
    </Container>
  );
};

export default Connections;
