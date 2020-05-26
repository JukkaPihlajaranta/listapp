import React from 'react';
import axios from 'axios';
import UserContext from './tools/Context';
import {Link} from "react-router-dom";

export default class LoginPage extends React.Component {

    static contextType = UserContext;

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
            // console.log(res);
            // console.log(res.data.token);
            
            localStorage.setItem('auth-token', res.data.token);
            

            this.setState({
                email:'',
                password:'',
                errorMsg:''
            },() => {
                window.location = '/home'; //gives the token and user name etc.
                // this.props.history.push('/');
            });
        })
        .catch(err => {
            
            
            this.setState({
                errorMsg: err.response.data.msg
            })
            
        })
    };

    MoveToHomePage(){
        window.location = '/home';
    }

    render(){
        if (this.context.userData.user === undefined){
            return <div>

                <br/>
                Fill in the information below and sign in!
                <br/>
                <br/>
                <div className="errorMsg">{this.state.errorMsg !== '' && this.state.errorMsg}</div>
            <form onSubmit={this.ToServer_Login}>

                <input required className="textInput" placeholder=" Email" name="email" value={this.state.email} onChange={this.OnChange}/><br />
                <input required className="textInput" type="password" placeholder=" Password" name="password" value={this.state.password} onChange={this.OnChange}/><br />
                
                <div style={{justifyContent: "space-between", display: "flex", width: 200}}>
                    <div><Link className="btn blue" to='/register'>Register page</Link></div>
                    <div><button className="btn green" type="submit">Login!</button></div>
                </div>
                
            </form>
        </div>
        }

        this.MoveToHomePage()
    }

}