import React from 'react';
import {Link} from "react-router-dom";

export default class Navbar extends React.Component {


    render(){
        return <div className="navbar">
            
                    NavBar
                    <Link to='/'>Home</Link>
                    <Link to='/lists'>Lists</Link>
                </div>
    }

}