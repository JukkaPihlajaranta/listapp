import React, {useState, useEffect} from 'react';

import { BrowserRouter, Switch, Route } from "react-router-dom";
import UserContext from './components/tools/Context';
import CustomRoute from './components/tools/Route_Custom';
import AdminRoute from './components/tools/Route_Admin';
import axios from 'axios';


import Navbar from './components/Navbar';
import AdminPage from './components/AdminPage';

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import ShoppingLists from './components/ShoppingLists';
import EditShoppingList from './components/EditShoppingList'



import './App.css';


export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
    drog: false
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('auth-token');
      
      if (token === null) {
        localStorage.setItem('auth-token', '');
        token = '';
      }

      const tokenRes = await axios.post('/tokenIsValid', null,
      {headers: {'x-auth-token': token}});
      
      // console.log(tokenRes);

      if (tokenRes.data){
        const userRes = await axios.get('/users', 
        {headers: {'x-auth-token': token}}
        );
      
        console.log(userRes);

        setUserData({
          token,
          user: userRes.data,
          drog: userRes.data.admin
        })  
        
        
      }
    }

    checkLoggedIn();
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{userData, setUserData}}>
      <Navbar/>
      <div className="subContainer">
      <Switch>

          <Route path='/login' component={LoginPage} />
          <Route path='/register' component={RegisterPage} />

          <Route exact path='/' component={HomePage} />
          <CustomRoute path='/lists' component={ShoppingLists} />
          <CustomRoute path='/edit/:id' component={EditShoppingList} />

          <AdminRoute path='/adminpage' component={AdminPage} />

        
      </Switch>
      </div>
      </UserContext.Provider>
    </BrowserRouter>

  );
}


