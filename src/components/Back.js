import React from "react";
import { Link } from "react-router-dom";
import { withLastLocation } from "react-router-last-location";

const Back = ({ lastLocation }) => (
    
  (lastLocation ) && <Link to={lastLocation || '/'}>Back to previous page</Link>
);

export default withLastLocation(Back);