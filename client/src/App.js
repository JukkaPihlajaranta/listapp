import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import ShoppingLists from './components/ShoppingLists';

import './App.css';


export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Navbar/>

        <div className="subContainer">;



          <Route path='/login' component={LoginPage} />
          <Route path='/register' component={RegisterPage} />

          <Route exact path='/' component={HomePage} />
          <Route path='/admin' component={AdminPage} />
          <Route path='/lists' component={ShoppingLists} />
        

        </div>
      </Switch>
    </BrowserRouter>

  );
}


