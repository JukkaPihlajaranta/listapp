import React from 'react';
import axios from 'axios';
import UserContext from './tools/Context';
import OneShopList from './OneShopList';
// import {Link} from "react-router-dom";

export default class ShoppingLists extends React.Component {

    static contextType = UserContext;

    constructor (props){
        super(props);


        this.ToServer_NewList = this.ToServer_NewList.bind(this);
        this.OnChange = this.OnChange.bind(this);
        this.ToServer_GetLists = this.ToServer_GetLists.bind(this);

        this.state ={
            shoplists: [],
            userId: '',
            userName: '',
            newListName: '',
            errorMsg: ''
        }

    }

    componentDidMount(){
        
        this.setState({
            userId: this.context.userData.user.id,
            userName: this.context.userData.user.displayName,
        }, ()=>{
            this.ToServer_GetLists(); //get the info after in the setState callback
        });

    }

    OnChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    ToServer_GetLists(){
        
        axios({
            url: `/api/allshoplists/${this.state.userId}`,
            method: 'GET',
            // data: payload
        })
        .then(res => {

            this.setState({
                shoplists: res.data
            })
            
        })
        .catch(err => {
            console.log(err);
        })
    }

    ToServer_NewList(){
        
        if (this.state.newListName !== ''){

            const payload = {
                listName: this.state.newListName,
                userId: this.state.userId,
                userName: this.state.userName,
            }
    


            axios({
                url: '/api/createShopList',
                method: 'POST',
                data: payload
            })
            .then(() => {
                console.log('data added successfully!');
                
                this.setState({
                    errorMsg: ''
                })

                this.ToServer_GetLists();
            })
            .catch(err => {
                // this.setState({
                //     errorMsg: err.data.msg
                // })
                // console.log(err);
            })
        }

        else{
            this.setState({
                errorMsg: 'Please give the list a name'
            })
        }

    };

    DisplayShopLists(list){

        if (list.length === 0) return <div>You don't have any lists</div>

        return list.map((list, index) => 
        <div key={index}><OneShopList value={list} /></div>
        
        )

    }


    render(){
        return <div>
                {this.state.errorMsg !== '' &&  <span className="errorMsg">{this.state.errorMsg}</span> }
                <input className="textInput" placeholder=" New list" name="newListName" value={this.state.newListName} onChange={this.OnChange} />
                <button className="btn green" onClick={() => this.ToServer_NewList()}>Create</button>
                <br/><br/>
                {this.DisplayShopLists(this.state.shoplists)}

            </div>
    }

}