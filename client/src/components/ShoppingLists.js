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
        this.Get_AllLists = this.Get_AllLists.bind(this);

        this.state ={
            shoplists: [],
            newListName: '',
            errorMsg: ''
        }

    }

    componentDidMount(){
        this.Get_AllLists();
        // console.log(this.context);
    }

    OnChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    Get_AllLists(){
        
        const payload = {
            something: 'some'
        }
        
        axios({
            url: '/api/allshoplists',
            method: 'POST',
            data: payload
        })
        .then(res => {

            this.setState({
                shoplists: res.data
            })
            // console.log(res.data);
            
        })
        .catch(err => {
            // this.setState({
            //     errorMsg: err.data.msg
            // })
            console.log(err);
        })
    }

    ToServer_NewList(){
        
        if (this.state.newListName !== ''){

            const payload = {
                listName: this.state.newListName,
                userId: '',
                userName: '',
            }
    
            this.setState({
                errorMsg: ''
            })

            axios({
                url: '/api/createShopList',
                method: 'POST',
                data: payload
            })
            .then(res => {
                console.log('data added successfully!');
                //add to context thing user auth
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
                {this.state.errorMsg !== '' &&  this.state.errorMsg}
                <input placeholder=" New list" name="newListName" value={this.state.newListName} onChange={this.OnChange} />
                <button className="btn green" onClick={() => this.ToServer_NewList}>Create</button>
                <br/><br/>
                {this.DisplayShopLists(this.state.shoplists)}

            </div>
    }

}