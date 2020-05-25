import React from 'react';
import { Route, Redirect } from "react-router-dom";
import UserContext from './Context';

const CustomRoute = ({ component: Component, ...rest }) => {
    
    const usercontext = React.useContext(UserContext);
    
    
    return (
            <Route {...rest} render={(props) => (
            usercontext.userData.user !== undefined ? 
            
            <Component {...props} /> 
            
            : 
            
            <Redirect to='/login' />
            )} />

            )    
    
}

export default CustomRoute;