import React from 'react';
import axios from 'axios';
import UserContext from './tools/Context';

import {Link} from "react-router-dom";

export default class EditShoppingList extends React.Component {

    static contextType = UserContext;

    constructor (props){
        super(props);


        this.ToServer_UpdateShopListName = this.ToServer_UpdateShopListName.bind(this);
        this.ToServer_DeleteItem = this.ToServer_DeleteItem.bind(this);
        this.ToServer_AddNewItem = this.ToServer_AddNewItem.bind(this);
        this.ToServer_DeleteWholeList = this.ToServer_DeleteWholeList.bind(this);
        this.ToServer_GetList = this.ToServer_GetList.bind(this);
        // this.ToServer_ShareThisList = this.ToServer_ShareThisList.bind(this);

        this.OnChange = this.OnChange.bind(this);
        this.ShowHideMenu = this.ShowHideMenu.bind(this);

        this.state ={
            listItems: [],
            shoplistName: '',
            shoplistId: this.props.match.params,
            listSharedWith: [],
            

            newName: '',
            addItem: '',
            deleteListName: '',
            openHideEditPanel: false,
            userEmailToShareWith: '',

            errorMsgGeneral: '',
            errorMsgUpdateListName: '',
            errorMsgNewItem: '',
            errorMsgDeleteShopList: '',
            errorMsgSharingTheList: '',
            
        }

    }

    componentDidMount(){
        // console.log(this.props.match.params)
        this.ToServer_GetList();
        
    };

    OnChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    ShowHideMenu(){

        let tempStatus = this.state.openHideEditPanel;
        tempStatus = !tempStatus
        
        this.setState({
            openHideEditPanel: tempStatus
        });
    };

    ToServer_GetList(){
        
        axios({
            url: `/api/edit/${this.state.shoplistId.id}`,
            method: 'GET',
            data: null
        })
        .then(res => {
            // console.log(res);
            
            this.setState({
                shoplistName: res.data.listName,
                listItems: res.data.shopItemList,
                listSharedWith: res.data.listSharedWith
            })
        })
        .catch(err => {

            console.log(err);
        });


    };

    ToServer_UpdateShopListName(){
        
        if (this.state.newName !== ''){

            const payload = {
                targetList: this.state.shoplistId.id,
                newListName: this.state.newName,
            }
    


            axios({
                url: '/api/changeShoplistName',
                method: 'PUT',
                data: payload
            })
            .then(() => {
                console.log('data added successfully!');
                

                this.setState({
                    shoplistName: this.state.newName,
                    newName: '',

                    errorMsgGeneral: '',
                    errorMsgDeleteShopList: '',
                    errorMsgNewItem: '',
                    errorMsgUpdateListName: '',
                    errorMsgSharingTheList: ''
                })
            })
            .catch(err => {
                console.log(err);
            })
        }

        else{
            this.setState({
                errorMsgUpdateListName: 'Please give the list a name'
            })
        }

    };

    ToServer_AddNewItem(e){
        e.preventDefault();

        if (this.state.addItem !== ''){

            const payload = {
                addedItem: this.state.addItem,
            }
    
            axios({
                url: `/api/edit/${this.state.shoplistId.id}`,
                method: 'PUT',
                data: payload
            })
            .then(res => {
                
                this.setState({
                    listItems: res.data.shopItemList,
                    addItem: '',

                    errorMsgGeneral: '',
                    errorMsgDeleteShopList: '',
                    errorMsgNewItem: '',
                    errorMsgUpdateListName: '',
                })

            })
            .catch(err => {
                console.log(err);
            })
        }

        else{
            this.setState({
                errorMsgNewItem: 'Please give item a name'
            })
        }

    };

    ToServer_DeleteItem(itemId){
        
        const tempList = [...this.state.listItems]

        for (var i = 0; i < tempList.length; i++){
            if (tempList[i]._id === itemId){
                tempList.splice(i, 1);
                break;
            }
        }

        const payload = {
            targetItem: itemId,
            targetList: this.state.shoplistId.id
        }

        axios({
            url: `/api/deleteItem`,
            method: 'PUT',
            data: payload
        })
        .then(() => {
            
            this.setState({
                listItems: tempList,

                errorMsgGeneral: '',
                errorMsgDeleteShopList: '',
                errorMsgNewItem: '',
                errorMsgUpdateListName: '',
                errorMsgSharingTheList: ''
            });

        })
        .catch(err => {
            console.log(err);
        })

    };

    ToServer_DeleteWholeList(){
        
        if (this.state.listSharedWith.length > 0)
        {
            this.setState({
                errorMsgDeleteShopList: "Unshare this list before deleting it."
            });
            return
        }


        if (this.state.shoplistName === this.state.deleteListName){

            const payload = {
                targetList: this.state.shoplistId.id
            }
    
            axios({
                url: `/api/deletelist`,
                method: 'DELETE',
                data: payload
            })
            .then(() => {
                this.props.history.push('/lists');         
    
            })
            .catch(err => {
                console.log(err);
            })
        }

        else{
            this.setState({
                errorMsgDeleteShopList: "The name does't match with the current shoplist name."
            });
        }


    };

    ToServer_ShareThisList(){

        if (this.state.userEmailToShareWith === this.context.userData.user.email){
            
            this.setState({
                errorMsgSharingTheList: "You cannot share your own list with yourself!"
            });
            return
        }

        if (this.state.userEmailToShareWith === ''){
            this.setState({
                errorMsgSharingTheList: "Please type in an email!"
            });
            return
        }

        for (var i = 0; i < this.state.listSharedWith.length; i++){
            if (this.state.listSharedWith[i].userEmail === this.state.userEmailToShareWith){
                this.setState({
                    errorMsgSharingTheList: "This list has been already share with that user!"
                });
                return
            }
        }

        const payload = {
            userEmail: this.state.userEmailToShareWith,
            listId: this.state.shoplistId.id
        }

        console.log(payload);

        axios({
            url: `/api/sharelist`,
            method: 'PUT',
            data: payload
        })
        .then((res) => {
            
            this.setState({
                listSharedWith: res.data.listSharedWith,

                errorMsgGeneral: '',
                errorMsgDeleteShopList: '',
                errorMsgNewItem: '',
                errorMsgUpdateListName: '',
                errorMsgSharingTheList: ''
            }, () => {

                // this.ShowSharedListInfo();
            });

        })
        .catch(err => {
            console.log(err.response);
            this.setState({
                errorMsgSharingTheList: err.response.data.msg
            })
        })
    }


    //Unshare a list
    ToServer_UnShareThisList(removeEmail){

        const tempList = [...this.state.listSharedWith]
        let tempUserId;

        for (var i = 0; i < tempList.length; i++){
            if (tempList[i].userEmail === removeEmail){
                tempUserId = tempList[i].userId;
                tempList.splice(i, 1);
                break;
            }
        }

        this.setState({
            listSharedWith: tempList
        });

        const payload = {
            userId: tempUserId,
            userEmail: removeEmail,
            listId: this.state.shoplistId.id
        }

        console.log(payload);

        axios({
            url: `/api/desharelist`,
            method: 'PUT',
            data: payload
        })
        .then(() => {
            
            this.setState({
                errorMsgGeneral: '',
                errorMsgDeleteShopList: '',
                errorMsgNewItem: '',
                errorMsgUpdateListName: '',
                errorMsgSharingTheList: ''
            }, () => {

                // this.ShowSharedListInfo();
            });

        })
        .catch(err => {
            console.log(err.response);
            this.setState({
                errorMsgSharingTheList: err.response.data.error
            })
        })
    }

    DisplayShopList(list){

        if (list.length === 0) return (<div>
            <br/>
            <br/>
            <div className="errorMsg">You don't have any lists</div>
            <br/>
            <br/>
        </div>
        
        )

        return list.map((list, index) => 
        <div style={{marginLeft: 20}} key={index}>
            
            
            <button className="btn red" onClick={() => this.ToServer_DeleteItem(list._id)} >Delete</button>
            <span style={{marginLeft: 5, color: "dimgray"}}>{list.itemName}</span> 
            
        </div>
        
        )
    };


    //SHOW SHARED LISTS
    ShowSharedListInfo(list){
        
        if (list.length === 0) return <div className="errorMsg">You haven't shared this list with anyone.</div>

        return list.map((list, index) => 
            <div style={{marginLeft: 20}} key={index}>
            
                <button className="btn orange" onClick={() => this.ToServer_UnShareThisList(list.userEmail)}>Unshare</button>
                <span style={{marginLeft: 5, color: "dimgray", verticalAlign: "middle"}}>Shared with <span className="listTopic" style={{color: "limegreen"}}>{list.userEmail}</span></span> 
        
            </div>

        
        )
    }


    truncate(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '...' : str;
    };

    render(){
        return <>
                <div>Edit - <span className="listTopic">{this.truncate(this.state.shoplistName, 20)} </span> ({this.state.listItems.length}) 
                <button className="btn orange" onClick={() => this.ShowHideMenu()}> {this.state.openHideEditPanel ? " < " : " > "} </button>
                
                
                </div>
                {this.state.openHideEditPanel && 
                
                <div className="editMenuPanel">
                    {this.state.errorMsgUpdateListName !== '' &&  <span className="errorMsg">{this.state.errorMsgUpdateListName}</span> }
                    <input className="textInput" placeholder=" New list name" name="newName" value={this.state.newName} onChange={this.OnChange} />
                    <button className="btn orange" onClick={() => this.ToServer_UpdateShopListName()}>Change</button> 
                    <br/>
                    {this.state.errorMsgDeleteShopList !== '' &&  <span className="errorMsg">{this.state.errorMsgDeleteShopList}<br/></span> }
                    <input className="textInput" placeholder=" Type the list name here" name="deleteListName" value={this.state.deleteListName} onChange={this.OnChange} />
                    <button className="btn red" onClick={() => this.ToServer_DeleteWholeList()}>Delete</button>
                    <br/>
                    {this.state.errorMsgSharingTheList !== '' &&  <span className="errorMsg">{this.state.errorMsgSharingTheList}<br/></span> }
                    <input className="textInput" placeholder=" User email" name="userEmailToShareWith" value={this.state.userEmailToShareWith} onChange={this.OnChange} />
                    <button className="btn green" onClick={() => this.ToServer_ShareThisList()}>Share!</button>
                    {this.state.listSharedWith !== undefined && this.ShowSharedListInfo(this.state.listSharedWith)}
                </div>
                }

                <div className="editShoplistWrapper">
                    {this.DisplayShopList(this.state.listItems)}
                </div>
                
                
            
                <form onSubmit={this.ToServer_AddNewItem} className="editAddPanel">
                    {this.state.errorMsgNewItem !== '' &&  <span className="errorMsg">{this.state.errorMsgNewItem}</span> }

                    <input className="textInput" placeholder=" New item" name="addItem" value={this.state.addItem} onChange={this.OnChange} />
                    <button type="submit" className="btn green">Add</button>
                </form>
                <br/>
                <Link className="btn blue" to='/lists'>Return</Link>
            </>
    }

}