import React from 'react';
import {Link} from "react-router-dom";
import UserContext from './tools/Context';


export default class Navbar extends React.Component {

    static contextType = UserContext;

    constructor (props){
        super(props);

        

        this.Logout = this.Logout.bind(this);

        this.state = {
            email:'',
            password:'',
            errorMsg:''
        }

    }
    
    Logout(){

        localStorage.removeItem('auth-token');
        // this.props.history.push('/login');
        window.location = '/login'
    }



    render(){
        return <div className="navbar">
            
                    <div>
                    listApp
                    {this.context.userData.user !== undefined &&
                    <>
                        <Link className="btn blue" to='/'>Home</Link>
                        <Link className="btn blue" to='/lists'>Lists</Link>
                        <Link className="btn orange" to='/adminpage'>Admin</Link>
                    </>
                    }
                    
                    </div>
                    {this.context.userData.user !== undefined &&
                    <button className="btn red" onClick={() => this.Logout()}>Logout</button>
                    }
                </div>
    }

}