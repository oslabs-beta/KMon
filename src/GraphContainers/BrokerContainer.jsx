import React from "react";
import BytesInBytesOut from "../GraphComponents/BytesinBytesOut.jsx";
import ProducerLatency from "../GraphComponents/ProducerLatency.jsx";
// import ConsumerLatency from "../GraphComponents/ConsumerLatency.jsx";

function BrokerContainer(){
    // const src = '<insertGrafanaUrlHere>'; //use large object with keys? so that clicks on front end could select specific metrics to send as urls into each component and render conditionally?
    return(
        <div>
            <BytesInBytesOut/>
            <ProducerLatency/>
            {/* <ConsumerLatency/> */}
        </div>
    )
}
export default BrokerContainer;