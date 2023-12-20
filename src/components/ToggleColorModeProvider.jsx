// import React, { createContext, useMemo, useState } from 'react';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// const  ToggleColorModeProvider = ({ children }) => {
//   const [mode, setMode] = useState('light');

//   const toggleColorMode = () => {
//     setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
//   };

//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode,
//         },
//       }),
//     [mode]
//   );

//   return (
//     <ColorModeContext.Provider value={{ toggleColorMode }}>
//       <ThemeProvider theme={theme}>{children}</ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// };
// export default ToggleColorModeProvider;