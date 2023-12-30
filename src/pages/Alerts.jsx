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

  // showAlert determines if alerts should be shown
  const [showAlert, setShowAlert] = useState(false);
  // notifications is an array to store alert data
  const [notifications, setNotifications] = useState([]);

  /* Data for simulating fetching data from Prometheus for just one notification 

  Breakdown of the data structure: 
    notification (Object): Notification object that gets stored in the notifications array
      data (Object): An object containing data related to the notification.
        alerts (Array): An array of alert objects.
          alert (Object): Each alert object.
            For each alert, there are properties like labels, annotations, state, activeAt, value, etc.
  */

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
    TO DO: Uncomment the following block to fetch alerts from Prometheus 
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

  /* 
    TO DO: Comment out the following block for production
    Simulate fetching data from the server with dummy data, runs once component mounts
  */
  useEffect(() => {
    const fetchData = () => {
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

  // Remove an alert from the notifications array when the user clicks on the 'x' (close) button for the alert
  const handleRemoveAlert = (alertNameToRemove) => {
    setNotifications((prevNotifications) => {
      // Create a new notifications array by iterating over each notification in the previous state
      const updatedNotifications = prevNotifications.map((notification) => {
        // For each notification, create a new object
        const updatedNotification = {
          ...notification, // Spread existing properties of the notification
          data: {
            ...notification.data, // Spread existing properties of the data object within the notification
            // Update the alerts array by not including the alert to be removed
            alerts: notification.data.alerts.filter(
              (alert) => alert.labels.alertname !== alertNameToRemove
            ),
          },
        };
        return updatedNotification;
      });

      // Check if at least one notification has alerts remaining, return boolean value
      const hasRemainingAlerts = updatedNotifications.some(
        (notification) => notification.data.alerts.length !== 0
      );

      // Set showAlert to true if there are remaining alerts, false if not
      setShowAlert(hasRemainingAlerts);

      // Return the updated notifications array
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
              // Map over the alerts array within each notification 
              notification.data.alerts.map((alert) => (
                // Render an AlertCard component for each alert with properties passed from the alert object
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