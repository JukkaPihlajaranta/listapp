import React from 'react';


export default class AdminPage extends React.Component {

    constructor (props){
        super(props);


        this.state = {
            users: [],
            all_lists: []
        }

    }

    render(){
        return <div>Admin page</div>
    }

}