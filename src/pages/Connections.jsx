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
  
  const userID = userInfo.userID;

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  const [rows, setRows] = useState([]);
  const [portIsClicked, setPortIsClicked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clusterName: 'Demo',
    serverURI: '10.0.10.137',
    ports: ['8994', '8995', '8996', '8997', '8998', '8999'],
    apiKey: '',
    apiSecret: '',
  });
  const [alertProps, setAlertProps] = useState({
    visibility: 'hidden',
    height: 0,
    message: ''
  })

  // useEffect to render saved connections upon first load;
  useEffect(() => {
   (async () => {
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
        uri: obj.cluster_uri,
        ports: obj.ports,
        created: obj.created_on
      }
    })
    setRows([...connectionData])
    })();
  }, [])


  const handleSubmit = async (event) => {
    
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
          const id = rows.length + 1;
          const {clusterName, serverURI, ports} = formData;
          const currDateStr = new Date();
          const [month, date, year] = [currDateStr.getMonth(), currDateStr.getDate(), currDateStr.getFullYear().toString().slice(2)]
          const createdDate = `${month}/${date}/${year}`

          const newRow = {
            id: id,
            name: clusterName,
            uri: serverURI,
            ports: ports,
            created: createdDate
          }

          const dbResponse = await fetch(`${apiUrl}/api/saveConnection`, {
            method: 'POST',
            headers: {
              'CONTENT-TYPE': 'application/json'
            },
            body: JSON.stringify({...newRow, userID: userID})
          });


          console.log('Connections - dbResponse: ', dbResponse);
          if (dbResponse.status === 409) {
            setAlertProps({
              visibility: 'visible',
              marginTop: '15px',
              height: '100%',
              message: 'Duplicate connections found in database'
            })
            return;
          }

          console.log("about to create config yamls")
          const response = await fetch(`${apiUrl}/api/createConnection`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData
            }),
          });

          // Logic for creating new row when a server information is inputted and processed in back end.
          if (response.ok) {
            const data = await response.json();
            console.log('data submitted! data: ', data)
            
            const currRows = [...rows];
            currRows.push(newRow);
            setRows(currRows);

            setSubmitting(false);
            setFormData({
              clusterName: '',
              serverURI: '',
              ports: [],
              apiKey: '',
              apiSecret: '',
            });

            setAlertProps({
              visibility: 'hidden',
              marginTop: '15px',
              height: '0',
              message: ''
            });

          } else {
            console.log('Failed to save credentials');
          }
        } catch (error) {
          console.log('Error in Credential Form: ', error);
        }
    }
    else {
      event.preventDefault();
    }
  };

  return (
    <Container sx={containerStyle}>
      <div>
        <h1>Saved Connections</h1>
        <ConnectionDialogBox submitting={[submitting, setSubmitting]} portIsClicked={[portIsClicked, setPortIsClicked]} formData={[formData, setFormData]} handleSubmit={handleSubmit} alertProps={[alertProps, setAlertProps]}/>
      </div>
      <ConnectionsTable rows={[rows, setRows]}/>
    </Container>
  );
};

export default Connections;
