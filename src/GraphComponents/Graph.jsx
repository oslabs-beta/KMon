import React from 'react';

function Graph({ id }) {
  return (
    <Box>
      <iframe
        src={`http://localhost:3000/d/ab97a8cb-08c6-4f4b-a81e-3cf22b397855/dashboard?orgId=1&var-PrometheusUID=PBFA97CFB590B2093&theme=dark&viewPanel=${id}`}
        width='450'
        height='200'
        frameborder='0'
      ></iframe>
    </Box>
  );
}

export default Graph;
