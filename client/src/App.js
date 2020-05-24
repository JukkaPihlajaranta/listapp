import React, {useState, useEffect} from 'react';

import { BrowserRouter, Switch, Route } from "react-router-dom";
import UserContext from './components/tools/Context';
import axios from 'axios';

import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import ShoppingLists from './components/ShoppingLists';

import './App.css';


export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: 'something'
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

      if (tokenRes.data){
        const userRes = await axios.get('/users', 
        {headers: {'x-auth-token': token}}
        );
        
        setUserData({
          token,
          user: userRes.data
        })  
        
        
      }
    }

  // checkLoggedIn();
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
          <Route path='/admin' component={AdminPage} />
          <Route path='/lists' component={ShoppingLists} />
        

        
      </Switch>
      </div>
      </UserContext.Provider>
    </BrowserRouter>

  );
}


