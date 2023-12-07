import React from "react";
import CpuUsage from "../GraphComponents/CpuUsage.jsx";
// import UnderReplication from "../GraphComponents/UnderReplication";
import DiskIO from "../GraphComponents/DiskIO.jsx";
function ProducerContainer(){

    return(
        <div>
            <DiskIO/>
            <CpuUsage/>
        </div>
    )
}
export default ProducerContainer;