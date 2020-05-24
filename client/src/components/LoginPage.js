import React from 'react';
import axios from 'axios';

import {Link} from "react-router-dom";

export default class LoginPage extends React.Component {

    constructor (props){
        super(props);

        this.OnChange = this.OnChange.bind(this);
        this.ToServer_Login = this.ToServer_Login.bind(this);

        this.state = {
            email:'',
            password:'',
            errorMsg:''
        }

    }

    OnChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    ToServer_Login(e){
        e.preventDefault();

        const payload = {
            email: this.state.email,
            password: this.state.password,
        }

        axios({
            url: '/login',
            method: 'POST',
            data: payload
        })
        .then(res => {
            console.log(res);
            //add to context thing user auth

            this.setState({
                email:'',
                password:'',
                errorMsg:''
            },() => {
                this.props.history.push('/')
            });
        })
        .catch(err => {
            this.setState({
                errorMsg: err.data
            })
            console.log(err);
        })
    };


    render(){
        return <div>
            
                Fill in the form and sign in!
            <form onSubmit={this.ToServer_Login}>

                <input placeholder=" Email" name="email" value={this.state.email} onChange={this.OnChange}/>*<br />
                <input placeholder=" Password" name="password" value={this.state.password} onChange={this.OnChange}/>*<br />
                
                <Link to='/register'>Register page</Link>
                <button type="submit">Login!</button>
            </form>
            
        </div>
    }

}