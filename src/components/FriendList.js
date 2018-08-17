import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Button} from 'react-bootstrap';
// import FriendEntry from './FriendEntry';
import {firebaseApp}  from '../firebase';

class FriendList extends Component {

    constructor(props){
        super(props)
        this.state={  list:null};
    }

  componentDidMount() {
    const { userId } = this.props.user;
    const listRef = firebaseApp.database().ref(userId + '/Friends');
    let list = null;
    listRef.on("value", snap => {

        list = [];
        snap.forEach(item => {
            const {email, userId, invitationKey, invitedFriendkey, relatedFriendKey} = item.val();
            const itemKey = item.key;
            list.push({email, userId, invitationKey, invitedFriendkey, relatedFriendKey, itemKey});
        });

        list = list.length == 0 ? null: list;

        this.setState({list});
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  onClickDeleteItem = (item) => {
    // item.serverKey, item.invitationKey, item.invitedFriendkey, item.relatedFriendKey

    const { userId } = this.props.user;
    firebaseApp.database().ref(userId + '/InvitedFriends/' + item.invitedFriendkey).remove();
    firebaseApp.database().ref(userId + '/IncomingInvitations/' + item.invitationKey).remove();
    firebaseApp.database().ref(userId + '/Friends/' + item.itemKey).remove();

    firebaseApp.database().ref(item.userId + '/InvitedFriends/' + item.invitedFriendkey).remove();
    firebaseApp.database().ref(item.userId + '/IncomingInvitations/' + item.invitationKey).remove();
    firebaseApp.database().ref(item.userId + '/Friends/' + item.relatedFriendKey).remove();
  }


  render(){
    const list = this.state.list;

    let listItemDetail =  list && list.sort((a, b) => a.email > b.email)
                        .map((item, index) =>
                        <div key = {index} style={{margin: '5px'}}>
                          <strong>{item.email}</strong>
                          <Button onClick={()=>this.onClickDeleteItem(item)} bsStyle="danger">&#x2715;</Button>
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


  export default connect(mapStateToProps, null)(FriendList);
