import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Button} from 'react-bootstrap';
import {firebaseApp}  from '../firebase';

class FriendIncomingInvitationList extends Component {

    constructor(props){
        super(props)
        this.state={  list:null};
    }

  componentDidMount() {
    const { userId } = this.props.user;
    const listRef = firebaseApp.database().ref(userId + '/IncomingInvitations');
    let list = null;
    listRef
        .orderByChild('status')
        .equalTo('waiting') 
        .on("value", snap => {

        list = [];
        snap.forEach(item => {
            const {email, invitedFriendkey, userId} = item.val();
            const itemKey = item.key;
            list.push({email, invitedFriendkey, userId, itemKey});
        });

        list = list.length == 0 ? null: list;

        this.setState({list});
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  onClickUpdateItemStatus = (itemKey, requestedUserId, invitedEmail, invitedFriendkey) =>{
    let { email, userId } = this.props.user;
    const status = 'active'; 
    let updates = {};
    updates['status'] = 'active';
    
    firebaseApp.database().ref(userId + '/IncomingInvitations/' + itemKey).update(updates);

    // talep eden kullanıcının 
    firebaseApp.database().ref(requestedUserId + '/InvitedFriends/' + invitedFriendkey).update(updates);
    firebaseApp.database().ref(userId + '/IncomingInvitations/' + itemKey).update(updates);
    
    
    const relatedFriendKeyByRequestedId = firebaseApp.database().ref(requestedUserId  + '/Friends').
            push({email, status, userId, invitedFriendkey,  invitationKey:itemKey, relatedFriendKey: null}).key;
  
    const relatedFriendKey =firebaseApp.database().ref(userId + '/Friends').push({
                    email :invitedEmail, status, userId: requestedUserId, invitedFriendkey,  
                    invitationKey:itemKey, relatedFriendKey: relatedFriendKeyByRequestedId}).key;

    let friendUpdates = {};
    friendUpdates['relatedFriendKey'] = relatedFriendKey;    
    firebaseApp.database().ref(requestedUserId + '/Friends/' + relatedFriendKeyByRequestedId).update(friendUpdates);                    

  }

  onClickDeleteItem = (itemKey, requestedUserId, invitedFriendkey) => {
    const { userId } = this.props.user;
    // talep eden kullanıcının 
    firebaseApp.database().ref(requestedUserId + '/InvitedFriends/' + invitedFriendkey).remove();
    firebaseApp.database().ref(userId + '/IncomingInvitations/' + itemKey).remove();
  }  

  render(){
    const list = this.state.list;
    
    let listItemDetail =  list && list.sort((a, b) => a.email > b.email)
                        .map((item, index) =>
                        <div key = {index} style={{margin: '5px'}}>
                          <strong>{item.email}</strong>
                          <Button onClick={()=>this.onClickUpdateItemStatus(item.itemKey, item.userId, item.email, item.invitedFriendkey)} bsStyle="success">&#x2714;</Button>
                          <Button onClick={()=>this.onClickDeleteItem(item.itemKey, item.userId, item.invitedFriendkey)} bsStyle="danger">&#x2715;</Button>
                        </div>
                        );    
    return (<div>
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
  
  
export default connect(mapStateToProps, null)(FriendIncomingInvitationList);
