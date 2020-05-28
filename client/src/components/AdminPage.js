import React from 'react';
import axios from 'axios';

export default class AdminPage extends React.Component {

    constructor (props){
        super(props);

        this.Get_everything = this.Get_everything.bind(this);
        this.UserListCount = this.UserListCount.bind(this);

        this.state = {
            users: [],
            all_lists: []
        }

    }

    componentDidMount(){
        this.Get_everything();
    }

    Get_everything(){

        axios({
            url: '/adminroute',
            method: 'GET'
        })
        .then((res)=>{
            this.setState({
                users: res.data.users,
                all_lists: res.data.shoplists
            });
        })
        .catch((err) => {
            console.log(err.response);
        });
    }

    UserListCount(userId){
        let listCount = 0;

        this.state.all_lists.forEach(count => {
            if (count.ownerId === userId) listCount++
        });

        return listCount;
    }

    render(){
        if (this.state.users.length > 0){
            return <div>
                <br/>
                <div className="listTopic">All users:</div><br/>
                <table>
                    
                    <tbody>
                        <tr>
                            <td></td>
                            <td className="listTopic"><div style={{width: 70}}>User</div></td>
                            <td className="listTopic"><div style={{width: 80}}>Email</div></td>
                            <td className="listTopic"><div style={{width: 50}}>Lists</div></td>
                            <td className="listTopic"><div style={{width: 50}}>Shared</div></td>
                        </tr>
                {this.state.users.map((user, index) => 
                    <tr key={index}>
                        <td><button className="btn green">Manage</button></td>
                        <td>{user.displayName}</td>
                        <td>{user.email}</td>
                        <td style={{textAlign: "center"}}>{this.UserListCount(user._id)}</td>
                        <td style={{textAlign: "center"}}>{user.sharedLists.length}</td>
                    </tr>
                    
                
                )}

                    </tbody>
                </table>

            </div>



        }
        return <div></div>
        
    }

}