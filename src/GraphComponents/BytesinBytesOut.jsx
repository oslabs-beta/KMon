import React, { useState, useEffect, useContext } from 'react';
// import DashboardContext from '../context/DashboardContext';

function BytesInBytesOut({ itemSizes, id }) {
  console.log('width and height', itemSizes[1]['width'] - 50, itemSizes[1]['height'] - 50);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(250);

  let w;
  let h;

  // let width, height;
  useEffect(() => {
    for (let i = 0; i < itemSizes.length; i++) {
      if (itemSizes[i]['id'] === id) {
        // w = itemSizes[i]['width'] - 50;
        // h = itemSizes[i]['height'] - 50;
        setWidth(itemSizes[i]['width'] - 50);
        setHeight(itemSizes[i]['height'] - 50);
      };
    }
  })

    // console.log('halp');

 
    const handler = () => {
      setHeight(height + 50);
      setWidth(width + 50);
    }

    return (
      <>
        <iframe
          src='http://localhost:3000/d-solo/eaad4742-52a8-44c1-a53b-d37453c47986/prometheus-dashboard-test?orgId=1&refresh=5s&panelId=2'
          // width={`${width}px`}
          // height={`${height}px`}
          frameborder='0'
          style={{pointerEvents: 'none', flexGrow: 1}}
        ></iframe>
        {/* <button onClick={handler}>
          hlksdkljsldfjklsdjflksjdklf
        </button> */}
      </>
    );
}

export default BytesInBytesOut;
