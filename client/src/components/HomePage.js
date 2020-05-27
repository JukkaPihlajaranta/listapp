import React from 'react';
import UserContext from './tools/Context';


export default class HomePage extends React.Component {

    static contextType = UserContext;

    // constructor (props){
    //     super(props);

    //     this.state={
    //         userName: null
    //     }
    // }

    
    render(){
        
        if (this.context.userData.user !== undefined){
            return <div><br/>
            Welcome <span className="listTopic" style={{color: "limegreen"}}>{this.context.userData.user.displayName}</span>!
            <br/>
            <br/>
            <br/>

            <div className="listTopic">Update 25.5.2020</div>
            <li>Finalizing the new application.</li>
            <br/>

            <div className="listTopic">Update 16.5.2020</div>
            <li>Platform changed from plain Nodejs/ejs to React.</li>
            <br/>

            <div className="listTopic">Update 18.3.2020</div>
            <li>Register and login system added.</li>
            <li>Users are able to add their own shoppinglist to their account and manage them.</li>
            <br/>

            <div className="listTopic">Update 12.1.2020</div>
            <li>Shopping list app created and some features added.</li>

            </div>

        }
            
        return <div></div>

        
    }

}