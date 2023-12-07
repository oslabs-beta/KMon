import React from 'react';
import ConnectionsTable from '../components/ConnectionsTable.jsx';
import ConnectionDialogBox from '../components/DialogBox.jsx';
import { Container } from '@mui/material';

const Connections = () => {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px',
  };

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
      // API Request to create a connection, TO BE UPDATED
      const response = await fetch('/api/createConnection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverURI: formData.serverURI,
          apiKey: formData.apiKey,
          apiSecret: formData.apiSecret,
        }),
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        console.log('Failed to save credentials');
      }
    } catch (error) {
      console.log('Error in CredentialForm: ', error);
    } finally {
      setSubmitting(false);
      setFormData({ serverURI: '', apiKey: '', apiSecret: '' });
    }
  };

  return (
    <Container sx={containerStyle}>
      <div>
        <h1>Connections</h1>
        <ConnectionDialogBox />
      </div>
      <ConnectionsTable />
    </Container>
  );
};

export default Connections;
