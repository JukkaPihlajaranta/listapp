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

        this.OnChange = this.OnChange.bind(this);
        this.ShowHideMenu = this.ShowHideMenu.bind(this);

        this.state ={
            listItems: [],
            shoplistName: '',
            shoplistId: this.props.match.params,

            newName: '',
            addItem: '',
            deleteListName: '',
            openHideEditPanel: false,

            errorMsgGeneral: '',
            errorMsgUpdateListName: '',
            errorMsgNewItem: '',
            errorMsgDeleteShopList: '',
            
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
                listItems: res.data.shopItemList
            })
        })
        .catch(err => {

            console.log(err);
        })
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
            });

        })
        .catch(err => {
            console.log(err);
        })

    };

    ToServer_DeleteWholeList(){
        
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
                this.props.history.push('/lists')            
    
            })
            .catch(err => {
                console.log(err);
            })
        }

        else{
            this.setState({
                errorMsgDeleteShopList: "The name does't match with the current shoplist name."
            })
        }


    };

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


    render(){
        return <>
                <div className="">Edit - {this.state.shoplistName} ({this.state.listItems.length}) 
                <button className="btn orange" onClick={() => this.ShowHideMenu()}> {this.state.openHideEditPanel ? " < " : " > "} </button>
                
                
                </div>
                {this.state.openHideEditPanel && 
                
                <div className="editMenuPanel">
                    {this.state.errorMsgUpdateListName !== '' &&  <span className="errorMsg">{this.state.errorMsgUpdateListName}</span> }
                    <input className="textInput" placeholder=" New list name" name="newName" value={this.state.newName} onChange={this.OnChange} />
                    <button className="btn orange" onClick={() => this.ToServer_UpdateShopListName()}>Change</button> <br/>

                    {this.state.errorMsgDeleteShopList !== '' &&  <span className="errorMsg">{this.state.errorMsgDeleteShopList}</span> }
                    <input className="textInput" placeholder=" Type the list name here" name="deleteListName" value={this.state.deleteListName} onChange={this.OnChange} />
                    <button className="btn red" onClick={() => this.ToServer_DeleteWholeList()}>Delete this list</button>
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