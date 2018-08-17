import React, { Component } from 'react';
import {connect} from 'react-redux';

import {firebaseApp}  from '../firebase';

class FriendEntry extends Component {

  constructor(props){
    super(props);
    this.state = {addFriendEmail : '',
                  error :{
                    message:''
                    }
                }
  }


  checkUsersExitsInSystem(){
    
    const {addFriendEmail} = this.state
        
    const dataRef = firebaseApp.database().ref('Users');

    let list = null;
    dataRef.orderByChild('email')
      .equalTo(addFriendEmail)    
      .once("value", snap => {

      list = [];
      
      snap.forEach(item => {
        var value = item.val();
        list.push(value);
      })
      
      if (list.length > 0)
      {
        
        const {email, uid} = list[0];
        this.checkUsersExitsInFriend(email, uid);
      }
      else
      {
        this.setErrorMessage('Sistemde bu kullanıcı bulunamadı!');
      }
      
      
    }, function (errorObject) {
       console.log("The read failed: " + errorObject.code);
    });    

  }

  checkUsersExitsInFriend = (email, uid) =>  {
    // let { userId, email } = user;
    let { userId } = this.props.user;
    
    const {addFriendEmail} = this.state;
    // this.checkDataExists(userId +'/InvitedFriends', 'email', addFriendEmail, this.setErrorMessage
    //   ,  this.addInvitation, 'Bu kişiye daha önceden davet gönderilmiştir.');


    const dataRef = firebaseApp.database().ref(userId +'/InvitedFriends');

    let list = null;
    dataRef.orderByChild('email')
      .equalTo(addFriendEmail)    
      .once("value", snap => {

      list = [];
      
      snap.forEach(item => {
        var value = item.val();
        list.push(value);
      })
      
      if (list.length > 0)
      {
        this.setErrorMessage('Bu kişiye daha önceden davet gönderilmiştir.');
      }
      else
      {
        this.addInvitation(email, uid);
      }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
        
  }

  setErrorMessage = (msg) => {
    this.setState({ error :{
      message:msg
      }})
  }

  addInvitation = (invitedUserEmail, invitedUid) => {
    

    const status = 'waiting';
    //Davet eden kullanıcı
    email = invitedUserEmail; 
    userId = invitedUid;
    const requestedUserId = this.props.user.userId;
    let invitationKey = null;
    const invitedFriendkey = firebaseApp.database().ref(requestedUserId  + '/InvitedFriends').push({ email, userId, status, invitationKey}).key;

    let { userId, email } = this.props.user;
    // Gelen Davetler
    
    invitationKey = firebaseApp.database().ref(invitedUid + '/IncomingInvitations').push({ email, userId, status, invitedFriendkey}).key;
    let updates = {};
    updates['invitationKey'] = invitationKey;    
    firebaseApp.database().ref(requestedUserId + '/InvitedFriends/' + invitedFriendkey).update(updates);
    
    this.closeAddFriendPopup();
  }


  addItemToList(){
    
    this.checkUsersExitsInSystem();
  }

  closeAddFriendPopup(){
    this.props.closeAddFriendPopupClick();
  }


  render(){
    return (<div>
              <div className="form-group">
                <input type="text"
                  className="form-control"
                  placeholder="email"
                  style={{marginRight:'5px'}}
                  onChange ={event => this.setState({addFriendEmail:event.target.value})} />
                <button className="btn btn-primary"
                  type="button"
                  onClick={()=>this.addItemToList()}>
                  Add
                </button>
                <button className="btn btn-primary"
                  type="button"
                  onClick={()=>this.closeAddFriendPopup()}>
                  Close
                </button>                
              </div>
              <div>{this.state.error.message}</div>
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


export default connect(mapStateToProps, null)(FriendEntry);