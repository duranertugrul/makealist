import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Button} from 'react-bootstrap';
import {firebaseApp}  from '../firebase';

class FriendInvitedList extends Component {

    constructor(props){
        super(props)
        this.state={  
          list:null,
          errorMessage :''
        };
    }

  componentDidMount() {
    const { userId } = this.props.user;
    const listRef = firebaseApp.database().ref(userId + '/InvitedFriends');
    let list = null;
    listRef
    .orderByChild('status')
    .equalTo('waiting') 
    .on("value", snap => {

        list = [];
        snap.forEach(item => {
            const {email, userId, invitationKey} = item.val();
            const serverKey = item.key;
            list.push({email, userId, invitationKey, serverKey});
        });

        list = list.length == 0 ? null: list;

        this.setState({list});
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  onClickDeleteItem = (itemKey, email, invitedUserId, invitationKey) => {
    const { userId } = this.props.user;
    firebaseApp.database().ref(userId + '/InvitedFriends/' + itemKey).remove();
    firebaseApp.database().ref(invitedUserId + '/IncomingInvitations/' + invitationKey).remove();
  }  


  

  render(){
    const list = this.state.list;
    
    let listItemDetail =  list && list.sort((a, b) => a.email > b.email)
                        .map((item, index) =>
                        <div key = {index} style={{margin: '5px'}}>
                          <strong>{item.email}</strong>
                          <Button onClick={()=>this.onClickDeleteItem(item.serverKey, item.email, item.userId, item.invitationKey )} bsStyle="danger">&#x2715;</Button>
                        </div>
                        );    
    return (<div>
                <div>{this.state.errorMessage}
                <hr/>
                </div>
                {list ? listItemDetail : 'Listeniz Bulunmamaktadır.'}
            </div>);
  }
}

function mapStateToProps(state) {
    const { user } = state
    console.log(state);
    return {
      user
    }
}
  
  
export default connect(mapStateToProps, null)(FriendInvitedList);
