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
        window.location = '/'
    }



    render(){
        return <div className="navbar">
            
                    <div style={{display: "inline-block", }}>
                        <img src="./ListApp_Img.png" alt="LISTAPP" height="35px"/>
                    
                    {this.context.userData.user !== undefined &&
                        <>
                            <Link className="btn blue" to='/home'>Home</Link>
                            <Link className="btn blue" to='/lists'>Lists</Link>
                            {this.context.userData.drog &&
                            <Link className="btn orange" to='/adminpage'>Admin</Link>
                            }
                            
                        </>
                    }
                    
                    </div>
                    {this.context.userData.user !== undefined  &&
                    <span style={{marginTop: 8}}>
                        <button className="btn red" onClick={() => this.Logout()}>Logout</button>
                    </span>
                    }
                </div>
    }

}