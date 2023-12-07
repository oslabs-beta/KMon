import React from 'react';
import Popup from 'reactjs-popup';
// import ConnectionsTable from '../components/ConnectionsTable.jsx';
import MaxWidthDialog from '../components/DialogBox.jsx';
// import { appContext } from './App';
import { Container } from '@mui/material'
import TextField from '@mui/material/TextField';
import { alpha } from "@mui/material";
// import 'reactjs-popup/dist/index.css';

const Connections = () => {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px'
  };
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

  return (
    <Container sx={containerStyle}>
    <div>
      <h1>Connections</h1>
        <MaxWidthDialog />
      </div>
      {/* <ConnectionsTable /> */}
    </Container>
  );
};

export default Connections;