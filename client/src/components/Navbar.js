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
            
                    <div style={{display: "flex" }}>
                        <img src="./ListApp_Img_new.png" alt="LISTAPP" height="34px"/>
                    
                    {this.context.userData.user !== undefined &&
                        <span style={{verticalAlign: "middle"}}>
                            <Link className="btn blue" to='/home'>Home</Link>
                            <Link className="btn blue" to='/lists'>Lists</Link>
                            {this.context.userData.user.sharedLists !== undefined &&
                            this.context.userData.user.sharedLists.length > 0 &&
                            <Link className="btn blue" to='/sharedList'>Shared</Link>
                            }
                            
                            {this.context.userData.drog &&
                            <Link className="btn orange" to='/adminpage'>Admin</Link>
                            }
                            
                        </span>
                    }
                    
                    </div>
                    {this.context.userData.user !== undefined  &&
                    <div style={{verticalAlign: "middle"}}>
                        <button className="btn red" onClick={() => this.Logout()}>Logout</button>
                    </div>
                    }
                </div>
    }

}