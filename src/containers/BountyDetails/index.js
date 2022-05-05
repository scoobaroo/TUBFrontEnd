import { useParams ,useLocation} from 'react-router-dom';
import appConfig from 'webpack-config-loader!../../app-config.js';
import React from 'react';
import axios from 'axios';


const BountyDetails = () => {
    const location = useLocation();
    const bountyId = location.state.BountyId;
    React.useEffect(() => {
        axios.get(`${appConfig.apiBaseUrl}bounties/${bountyId}`)
    }, [bountyId]);

    console.log('location', location);
    return (
        <div>#{bountyId}</div>
    )
}

export default BountyDetails;