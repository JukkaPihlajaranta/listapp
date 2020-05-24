import React from 'react';
// import {Link} from "react-router-dom";

export default class ShoppingLists extends React.Component {

    constructor (props){
        super(props);

        this.state ={
            lists: []
        }

    }

    render(){
        return <div>
                <input placeholder=" New list" />
                <button>Create</button>

                </div>
    }

}