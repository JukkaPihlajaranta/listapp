import React from 'react';
import axios from 'axios';


export default class AdminPage extends React.Component {

    constructor (props){
        super(props);

        this.Get_everything = this.Get_everything.bind(this);
        this.UserListCount = this.UserListCount.bind(this);
        this.ShowManagePage = this.ShowManagePage.bind(this);
        this.OnChange = this.OnChange.bind(this);

        this.state = {
            users: [],
            all_lists: [],

            userId: '',
            userName: '',
            userEmail: '',
            userLastLoggedIn: '',

            errorMsgPassChange: '',
            successMsgPassChange: '',
            password1: '',
            password2: '',

            showManagePage: false
        }

    }

    OnChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    componentDidMount(){
        this.Get_everything();
    }

    Get_everything(){

        axios({
            url: '/adminroute',
            method: 'GET'
        })
        .then((res)=>{
            console.log(res.data);
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

    ToServer_ResetUserPassword(userId){

        if (this.state.password1 === this.state.password2){

            const payload = {
                password: this.state.password1,
                userId: userId
            }

            axios({
                url: `/resetPassword`,
                method: 'PUT',
                data: payload
            })
            .then(res => {
                console.log(res)

                this.setState({
                    successMsgPassChange: 'Password changed successfully!',
                    errorMsgPassChange: '',
                    password1: '',
                    password2: ''
                });
            })
            .catch(err => {
                console.log(err);

            })

        }
        else{
            this.setState({
                errorMsgPassChange: "Passwords don't match"
            });
        }

    }


    ShowManagePage(userId){

        for (var i = 0; i < this.state.all_lists.length; i++){
            if (this.state.users[i]._id === userId){

                console.log("clicked");
                this.setState({
                    showManagePage: true,
                    userName: this.state.users[i].displayName,
                    userEmail: this.state.users[i].email,
                    userLastLoggedIn: this.state.users[i].lastLoggedIn,
                });
                
                break;
            }
        }

    }


    render(){
        if (this.state.users.length > 0){
            return <div>
                <br/>
                <div className="listTopic">All users:</div><br/>
                <table className="editShoplistWrapper">
                    
                    <tbody>
                        <tr>
                            <td></td>
                            <td className="listTopic"><div style={{width: 70}}>User</div></td>
                            {/* <td className="listTopic"><div style={{width: 80}}>Email</div></td> */}
                            <td className="listTopic"><div style={{width: 50}}>Lists</div></td>
                            <td className="listTopic"><div style={{width: 50}}>Shared</div></td>
                        </tr>
                {this.state.users.map((user, index) => 
                    <tr key={index}>
                        <td><button className="btn green" onClick={() => this.ShowManagePage(user._id)}>Manage</button></td>
                        <td>{user.displayName}</td>
                        {/* <td>{user.email}</td> */}
                        <td style={{textAlign: "center"}}>{this.UserListCount(user._id)}</td>
                        <td style={{textAlign: "center"}}>{user.sharedLists.length}</td>
                    </tr>
                    
                
                )}

                    </tbody>
                </table>
                <br/>
                {this.state.showManagePage && 
                <div style={{marginLeft: 10}}>
                    <div className="listTopic" style={{color: "limegreen"}}>{this.state.userName}</div>
                    <table className="editAddPanel">
                        <tbody >
                        <tr>
                            <td className="listTopic"><div style={{width: 90}}>Email:</div></td>
                            <td>{this.state.userEmail}</td>
                            
                        </tr>
                        <tr>
                            <td className="listTopic"><div style={{width: 90}}>Last log in:</div></td>
                            <td>{this.state.userLastLoggedIn}</td>
                        </tr>
                        <tr>
                            <td className="listTopic"><div style={{width: 90}}>Password</div></td>
                            <td><input className="textInput" placeholder=" Passowrd" name="password1" value={this.state.password1} onChange={this.OnChange} /></td>
                        </tr>
                        <tr>
                            <td className="listTopic"><div style={{width: 90}}>Password2</div></td>
                            <td><input className="textInput" placeholder=" Password again" name="password2" value={this.state.password2} onChange={this.OnChange} /></td>
                        </tr>
                        <tr>
                            <td className="listTopic"><div style={{width: 90}}></div></td>
                            <button onClick={() => this.ToServer_ResetUserPassword()} className="btn orange">Change</button>
                        </tr>
                        </tbody>
                    </table>
                    {this.state.successMsgPassChange !== '' && <span style={{color:"limegreen", fontSize: 14}}>this.state.successMsgPassChange</span>}
                    {this.state.errorMsgPassChange !== '' &&  <span className="errorMsg">this.state.errorMsgPassChange</span>}
                    
                </div>
                }

            </div>



        }
        return <div></div>
        
    }

}