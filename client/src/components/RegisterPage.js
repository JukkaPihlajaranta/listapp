import React from 'react';
import {Link} from "react-router-dom";

export default class RegisterPage extends React.Component {

    constructor (props){
        super(props);


        this.state={
            name: '',
            email: '',
            password: '',
            password2: '',
            errorMsg: '',
        }
    }

    render(){
        return <div>
            Please fill in the information below and register. * fields are mandatory.
            <form>
                <input placeholder=" name"/><br />
                <input placeholder=" email"/>*<br />
                <input placeholder=" Password"/>*<br />
                <input placeholder=" Password again"/>*<br />
                <Link to='/login'>Login page</Link>
                <button type="submit">Submit</button>
            </form>
        </div>
    }

}