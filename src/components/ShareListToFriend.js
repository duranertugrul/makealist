import React, { Component } from 'react';

import { Button } from 'react-bootstrap';
import {connect} from 'react-redux';
import {firebaseApp}  from '../firebase';



class ShareListToFriend extends Component {

  constructor(props){
    super(props)
  }
  
  
  closePanel = () =>{
    this.props.onClose();
  }

  onClickSendList(friendUserId, friendEmail){
    const { userId, email } = this.props.user;
    const listHeader = this.props.listHeader;
    const listHeaderId = this.props.listHeaderId;
    const status = 'waiting';
    let invitedListKey = null;
    const sentListkey = firebaseApp.database().ref(userId  + '/SentListHeader').push({ listHeader, 
              listHeaderId,  email :friendEmail , userId : friendUserId, status, invitedListKey}).key;

    // let { userId, email } = this.props.user;
    // Gelen Davetler
    
    invitedListKey = firebaseApp.database().ref(friendUserId + '/IncomingListHeader').push({ listHeader, 
              listHeaderId, email, userId, status, sentListkey}).key;
    let updates = {};
    updates['invitedListKey'] = invitedListKey;    
    firebaseApp.database().ref(userId + '/SentListHeader/' + sentListkey).update(updates);
    this.closePanel();
  }

  render(){

    const friendList = this.props.friendlist.list;
    
    let listItemDetail =  friendList && friendList.sort((a, b) => a.email > b.email)
                        .map((listItem, index) =>
                        <div key = {index} style={{margin: '5px'}}>
                          <strong>{listItem.email}</strong>
                          <Button onClick={()=>this.onClickSendList(listItem.userId, listItem.email)} bsStyle="success">&#x2714;</Button>
                        </div>
                        );
    return (<div>
                <div>
                Arkadaşlarım
                 <hr/>   
                {friendList ? listItemDetail : 'Listeniz Bulunmamaktadır.'}
                <Button onClick={this.closePanel}>Kapat</Button>
                </div>
            </div>);


  }
}

function mapStateToProps(state) {
    const {user, friendlist } = state
    console.log(state);
    return {
      user,
      friendlist
    }
  }
  
  
  export default connect(mapStateToProps, null)(ShareListToFriend);
