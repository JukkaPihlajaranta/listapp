import React from 'react';
import UserContext from './tools/Context';


export default class HomePage extends React.Component {

    static contextType = UserContext;

    constructor (props){
        super(props);

        this.state={
            userName: null
        }
    }

    
    render(){
        
        if (this.context.userData.user !== undefined){
            return <div><br/>
            Welcome {this.context.userData.user.displayName}!
            <br/>
            <br/>
            <br/>

            <h3>Update 25.5.2020</h3>
            <li>Finalizing the new application.</li>
            <br/>

            <h3>Update 16.5.2020</h3>
            <li>Platform changed from plain Nodejs/ejs to React.</li>
            <br/>

            <h3>Update 18.3.2020</h3>
            <li>Register and login system added.</li>
            <li>Users are able to add their own shoppinglist to their account and manage them.</li>
            <br/>

            <h3>Update 12.1.2020</h3>
            <li>Shopping list app created and some features added.</li>

            </div>

        }
            
        return <div></div>

        
    }

}