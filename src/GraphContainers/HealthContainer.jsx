import React from "react";
import CpuUsage from "../GraphComponents/CpuUsage";
import UnderReplication from "../GraphComponents/UnderReplication";
import DiskIO from "../GraphComponents/DiskIO";
function HealthContainer(){
    const src = '<insertGrafanaUrlHere>'; //use large object with keys? so that clicks on front end could select specific metrics to send as urls into each component and render conditionally?
    return(
        <div>
            <DiskIO/>
            <CpuUsage/>
            <UnderReplication/>
        </div>
    )
}
export default HealthContainer;