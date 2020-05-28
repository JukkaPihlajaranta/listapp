import React from 'react';
import axios from 'axios';
import UserContext from './tools/Context';
// import {Link} from "react-router-dom";

export default class SharedShoppingLists extends React.Component {

    static contextType = UserContext;

    constructor (props){
        super(props);


        
        
        this.ToServer_GetSharedLists = this.ToServer_GetSharedLists.bind(this);

        this.state ={
            sharedLists: [],
            userId: '',
            // userName: '',
            // newListName: '',
            // errorMsg: ''
        }

    }

    componentDidMount(){
        
        this.setState({
            userId: this.context.userData.user.id,
            // userName: this.context.userData.user.displayName,
        }, ()=>{
            this.ToServer_GetSharedLists(); //get the info after in the setState callback
        });

    }


    ToServer_GetSharedLists(){
        
        axios({
            url: `/api/sharedLists/${this.state.userId}`,
            method: 'GET',
            // data: payload
        })
        .then(res => {
            // console.log(res.data);
            this.setState({
                sharedLists: res.data.sharedLists
            })
            
        })
        .catch(err => {
            console.log(err.response);
        })
    }

 

    DisplayListContent(list){

        if (list.length === 0) return <div>This list doesn't have any items.</div>
        
        return list.map((list, index) => 
            <div  key={index}>
                
                <div className="oneItemRow"> {list.itemName}</div>
            </div>
        
        )

    }


    render(){
        if (this.state.sharedLists.length === 0) return <div>No any lists shared with you.</div>

        return <div>
                {this.state.sharedLists.map((list, index) => 
                <div key={index}>
                    <br/>
                    <div className="sharedListRow"><span className="listTopic">{list.listName} </span> 
                    list shared by <span className="listTopic" style={{color:"limegreen"}}>{ list.ownerName}</span>
                    </div>

                    <div className="sharedlistWrapper">
                        {this.DisplayListContent(list.shopItemList)}
                    </div>

                </div>
                )}
                

            </div>
    }

}