import React from "react";
import UnderReplication from "../GraphComponents/UnderReplication.jsx";
import ConsumerLatency from "../GraphComponents/ConsumerLatency.jsx";

function ConsumerContainer(){
    return(
        <div>
            <ConsumerLatency/>
            <UnderReplication/>
        </div>
    )
}
export default ConsumerContainer;