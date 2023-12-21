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
  console.log('Conections - userInfo: ', userInfo);
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

    console.log('Connections - data: ', data);

    const connectionData = data.map((obj) => {
      return {
        clusterID: obj.clusterid,
        clusterName: obj.clustername,
        ports: obj.ports,
        created: obj.created_on
      }
    })

    setRows([...connectionData])

    // const newRow = {
    //   id: id,
    //   name: clusterName,
    //   uri: serverURI,
    //   ports: ports,
    //   created: createdDate
    // }


  })();
  }, [])




  // working on testing connections..... not working yet
  // const testConnection = async (uri, ports) => {
  //   setInterval(() => {
  //     let failedFetch = 0;
  //     ports.forEach((port) => {
  //       fetch(`${uri}:${port}`)
  //       .then((response) => {
  //         if (response.ok) return;
  //       }).catch((err) => {
  //         console.error(err);
  //         failedFetch++;
  //       })
  //     })
  //   }, 60000)
  // }

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
          // MOVE TO "if (response.ok)" BLOCK AFTER TESTING!!! AND UN-COMMENT LINES IN THE BACK END!!
          
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

          

          const currRows = [...rows];
          currRows.push(newRow);
          setRows(currRows);


          if (response.ok) {
            const data = await response.json();
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

  return (
    <Container sx={containerStyle}>
      <div>
        <h1>Saved Connections</h1>
        <ConnectionDialogBox submitting={[submitting, setSubmitting]} portIsClicked={[portIsClicked, setPortIsClicked]} formData={[formData, setFormData]} handleSubmit={handleSubmit}/>
      </div>
      <ConnectionsTable rows={[rows, setRows]}/>
    </Container>
  );
};

export default Connections;
