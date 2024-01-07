import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const AlertCard = ({ alertname, description, title, service, severity, state, activeAt, value, instance, onRemove }) => {
  // Red for critical, orange for warning
  const borderColor = severity === 'critical' ? "#FF6347" : "#FFA500";

  return (
    <Card style={{ maxWidth: 800, margin: '0', border: `2px solid ${borderColor}`, padding: "10px", position: 'relative' }}>
      { /* Remove button only be rendered if the onRemove prop is provided */ }
      {onRemove && <IconButton
        aria-label="close"
        onClick={onRemove}
        style={{ position: 'absolute', top: 5, right: 5 }}
      >
        <CloseIcon />
      </IconButton>}
      <CardContent>
        <Typography style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10 }} color="text.primary" gutterBottom>
          Alert Name: {alertname}
        </Typography>
        <Typography style={{ marginBottom: 6 }} variant="body1" component="div">
          Description: {description}
        </Typography>
        <Typography style={{ marginBottom: 3 }} color="text.secondary">
          Title: {title}
        </Typography>
        <Typography style={{ marginBottom: 3 }} color="text.secondary">
          Service: {service}
        </Typography>
        <Typography style={{ marginBottom: 3 }} color="text.secondary">
          Severity: {severity}
        </Typography>
        <Typography style={{ marginBottom: 3 }} color="text.secondary">
          State: {state}
        </Typography>
        <Typography style={{ marginBottom: 3 }} color="text.secondary">
          Active at: {activeAt}
        </Typography>
        <Typography style={{ marginBottom: 3 }} color="text.secondary">
          Value: {value}
        </Typography>
        <Typography style={{ marginBottom: 3 }} color="text.secondary">
          Instance: {instance}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
