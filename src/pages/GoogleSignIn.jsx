import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
// import './Login.scss';

export default function Login({
  setSub,
  setLoggedIn,
  // setServerUri,
  // setApiKey,
  // setApiSecret,
  // setInDatabase,
  // setCookie
}) {
  // async function verifyUser(user) {
  //   const response = await fetch(`/api/checkUser/${user}`);
  //   const result = (await response.json())[0];
  //   // if user is stored in database, update sub, server, key, and secret states
  //   if (result) {
  //     setSub(result.user_id);
  //     setServerUri(result.server);
  //     setApiKey(result.key);
  //     setApiSecret(result.secret);
  //     setInDatabase(true);

  //     // create session object to store in cookie
  //     const userSession = {
  //       user_id: result.user_id
  //     }
  //     // set session cookie
  //     setCookie('kafka_courier_session', userSession, { path: '/' });
  //   }

  //   else setInDatabase(false);
  // }
  const navigate = useNavigate();

  return (
    <GoogleOAuthProvider>
      <div id="oauth">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const decoded = jwt_decode(credentialResponse.credential);
            console.log('decoded: ', decoded);
            setSub(decoded.sub);
            // await verifyUser(decoded.sub);
            setLoggedIn(true);
            navigate('/');
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
