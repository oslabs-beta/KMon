/* 
Component for displaying alerts.
Preferences are set in settings.
*/
import React, { useState, useEffect } from 'react';
import AlertCard from '.././components/AlertCard.jsx';
import { useTheme } from '@mui/material/styles';
import { Container } from '@mui/material';

const Alerts = () => {
  const theme = useTheme();
  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  const [showAlert, setShowAlert] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const dummyData = {
    data: {
      alerts: [
        {
          labels: {
            alertname: 'KafkaControllerHighCpu',
            job: 'kafka-controller',
            severity: 'critical',
            instance: 'controller-1',
          },
          annotations: {
            summary: 'High CPU usage in Kafka Controller',
            description: 'Kafka Controller is experiencing high CPU usage.',
            title: 'High CPU Alert in Kafka Controller',
          },
          state: 'active',
          activeAt: new Date().toISOString(),
          value: '0.85',
        },
        {
          labels: {
            alertname: 'KafkaControllerHighMemory',
            job: 'kafka-controller',
            severity: 'warning',
            instance: 'controller-1',
          },
          annotations: {
            summary: 'High memory usage in Kafka Controller',
            description: 'Kafka Controller is using a large amount of memory.',
            title: 'High Memory Alert in Kafka Controller',
          },
          state: 'active',
          activeAt: new Date().toISOString(),
          value: '1.2e9',
        },
      ],
    },
  };

  /*
    Uncomment the following block to fetch alerts from Prometheus 
    /api/v1/alerts endpoint to retrieve information about alerts at regular intervals (every 5 seconds)
  */
  // useEffect(() => {
  //   const fetchData = () => {
  //     fetch(`http://localhost:9090/api/v1/alerts`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // If there are alerts, set the notifications state and show alerts
  //         if (data.data.alerts.length !== 0) {
  //           setNotifications([data]);
  //           setShowAlert(true);
  //         } else {
  //           setShowAlert(false);
  //         }
  //       });
  //   };

  //   // Initial fetch and setup interval to fetch data every 5 seconds
  //   fetchData();
  //   const interval = setInterval(fetchData, 5000);

  //   // Cleanup the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, []);


  // Simulate fetching data from the server with dummy data
  useEffect(() => {
    const fetchData = () => {
      // Simulate fetching data from the server with dummy data
      const data = dummyData.data;

      if (data.alerts.length !== 0) {
        setNotifications([dummyData]);
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    };

    // Initial fetch
    fetchData();
  }, []);

  const handleRemoveAlert = (alertNameToRemove) => {
    // Remove the alert from the notifications state
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notification) => ({
        ...notification,
        data: {
          ...notification.data,
          alerts: notification.data.alerts.filter(
            (alert) => alert.labels.alertname !== alertNameToRemove
          ),
        },
      }));
      // Hide the alerts if there are no more
      setShowAlert(
        updatedNotifications.some(
          (notification) => notification.data.alerts.length !== 0
        )
      );
      return updatedNotifications;
    });
  };

  return (
    <Container sx={containerStyle}>
      <div>
        <h1>Alerts</h1>
        {showAlert ? (
          // If there are alerts, display each alert
          <div>
            {notifications.map((notification) =>
              notification.data.alerts.map((alert) => (
                <AlertCard
                  key={alert.labels.alertname}
                  alertname={alert.labels.alertname}
                  description={alert.annotations.description}
                  title={alert.annotations.title}
                  service={alert.labels.job}
                  severity={alert.labels.severity}
                  state={alert.state}
                  activeAt={alert.activeAt.toString()}
                  value={alert.value}
                  instance={alert.labels.instance}
                  onRemove={() => handleRemoveAlert(alert.labels.alertname)}
                />
              ))
            )}
          </div>
        ) : (
          // If there are no alerts, display a message
          <h4>No alerts at the moment.</h4>
        )}
      </div>
    </Container>
  );
};

export default Alerts;