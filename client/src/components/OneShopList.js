import React from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

export default class OneShopList extends React.Component {


    constructor (props){

        super(props);
        
        this.ShowList = this.ShowList.bind(this);
        this.ToServer_ItemCheckBox = this.ToServer_ItemCheckBox.bind(this);
        this.ToServer_ResetCheckBoxes = this.ToServer_ResetCheckBoxes.bind(this);
        this.ToServer_ShowHideList = this.ToServer_ShowHideList.bind(this);

        this.state = {
            itemList: this.props.value.shopItemList,
            
            listName: this.props.value.listName,
            listId: this.props.value._id,
            readyItems: this.props.value.readyItemsCount,
            itemCount: this.props.value.shopItemList.length,
            showList: this.props.value.showList,

        }
    }

    componentDidMount(){
        this.ShowList();
    };



    ToServer_ItemCheckBox(id){


        const tempList = [...this.state.itemList]
        let tempCount = 0;

        for (var i = 0; i < tempList.length; i++){
            if (tempList[i]._id === id){
                tempList[i].checked = !tempList[i].checked;
            }
        }


        for (var j = 0; j < tempList.length; j++){
            if (tempList[j].checked){
                tempCount++
            }
        }

        this.setState({
            itemList: tempList,
            readyItems: tempCount
        })

        const payload = {
            targetList: this.props.value._id,
            targetItem: id,
            readyItemsCount: tempCount
        }
        

        axios({
            url: '/api/modifyItemCheckMark',
            method: 'PUT',
            data: payload
        })
        .then(res => {
            // console.log(res);
          
        })
        .catch(err => {

            console.log(err);
        })

    }

    ToServer_ResetCheckBoxes(){
        const tempList = [...this.state.itemList]

        for (var i = 0; i < tempList.length; i++){
            tempList[i].checked = false;
                
        }

        const payload = {
            targetList: this.props.value._id,
        }
        

        this.setState({
            itemList: tempList,
            readyItems: 0
        })

        axios({
            url: '/api/uncheckall',
            method: 'PUT',
            data: payload
        })
        .then(res => {
            // console.log(res);
            
        })
        .catch(err => {

            console.log(err);
        })

    }
    
    ToServer_ShowHideList(){
        
        let checked = this.state.showList;
        checked = !checked

        const payload = {
            targetList: this.props.value._id,
        }
        

        this.setState({ showList: checked });

        axios({
            url: '/api/modifyShoplistCheckMark',
            method: 'PUT',
            data: payload
        })
        .then(res => {
            // console.log(res);
            
        })
        .catch(err => {

            console.log(err);
        })

    }
    
    truncate(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '..' : str;
    };

    ShowList(){
        return (
            <div>
                
                <div className="firstRow">
                    <div><input type="checkbox" checked={this.state.showList} onChange={this.ToServer_ShowHideList} /> {this.truncate(this.state.listName, 14)} ({this.state.readyItems}/{this.state.itemCount})</div>
                    
                    {this.state.showList &&
                        <div>
                            <button className="btn green" onClick={this.ToServer_ResetCheckBoxes}>Reset</button>
                            <Link className="btn green" to={`/edit/${this.state.listId}`} style={{marginLeft: 5}}>Edit</Link>
                        </div>
                    }
                    
                </div>

                {this.state.showList &&
                <div className="allShoplistWrapper">
                {this.state.itemList.map((item, index) => (

                    <div className="oneItemRow" key={index}> 
                        <input className="checkbox" type="checkbox" checked={item.checked} onChange={() => this.ToServer_ItemCheckBox(item._id)} />
                        <div className={item.checked ? "puchasedItem" : "non_puchasedItem"}>{item.itemName}</div>
                    </div>


                ))}
                </div>

                }
                <br/>

            </div>
        )
    }


    render(){
        return <>{this.ShowList()}</>

        

    }



}