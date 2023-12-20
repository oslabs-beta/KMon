/* for displaying alerts */
/* preferences are set in settings */
import React from 'react';
import { useTheme } from '@mui/material/styles';

const Alerts = () => {
  const theme = useTheme();

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };
};

export default Alerts;
