import React from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';

export default class RegisterPage extends React.Component {

    constructor (props){
        super(props);

        this.ToServer_Register = this.ToServer_Register.bind(this);
        this.OnChange = this.OnChange.bind(this);

        this.state={
            name: '',
            email: '',
            password: '',
            password2: '',
            errorMsg: '',
        }
    }

    OnChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    ToServer_Register(e){
        e.preventDefault();

        if (this.state.password !== this.state.password2) {
            this.setState({
                errorMsg: "Passwords don't match."
            });
            return
        }


        const payload = {
            displayName: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
        }

        axios({
            url: '/register',
            method: 'POST',
            data: payload
        })
        .then(res => {
            
            console.log(res);
            
            
            this.setState({
                name: '',
                email: '',
                password: '',
                password2: '',
                errorMsg: '',
            },() => {
                this.props.history.push('/login')
            });

        })
        .catch(err => {
            this.setState({
                errorMsg: err.data.msg
            })
            console.log(err);
        })
    };



    render(){
        return <div>
            Please fill in the information below and register. <br/>* fields are mandatory.<br/><br/>
            <div>{this.state.errorMsg !== '' && this.state.errorMsg}</div>
            <form onSubmit={this.ToServer_Register}>
                <input className="textInput" placeholder=" Name" name="name" value={this.state.name} onChange={this.OnChange}/><br />
                <input className="textInput" required placeholder=" Email" type="email" name="email" value={this.state.email} onChange={this.OnChange}/>
                <span className="errorMsg">*</span><br />

                <input className="textInput" required placeholder=" Password" type="password" name="password" value={this.state.password} onChange={this.OnChange}/>
                <span className="errorMsg">*</span><br />

                <input className="textInput" required placeholder=" Password again" type="password" name="password2" value={this.state.password2} onChange={this.OnChange}/>
                <span className="errorMsg">*</span><br />
                
                <div style={{justifyContent: "space-between", display: "flex", width: 200}}>
                    <div><Link className="btn blue" to='/login'>Login page</Link></div> 
                    <div><button className="btn green" type="submit">Submit!</button></div>
                </div>
            </form>
        </div>
    }

}