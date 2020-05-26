import React from 'react';
import { Route, Redirect } from "react-router-dom";
import UserContext from './Context';

const AdminRoute = ({ component: Component, ...rest }) => {
    
    const usercontext = React.useContext(UserContext);
    
    
    return (
            <Route {...rest} render={(props) => (
            usercontext.userData.drog ? 
            
            <Component {...props} /> 
            
            : 
            
            <Redirect to='/home' />
            )} />

            )    
    
}

export default AdminRoute;