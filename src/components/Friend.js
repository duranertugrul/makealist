import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Button, Tabs, Tab} from 'react-bootstrap';
import FriendEntry from './FriendEntry';

import FriendList from './FriendList';
import FriendInvitedList from './FriendInvitedList';
import FriendIncomingInvitationList from './FriendIncomingInvitationList';

import {firebaseApp}  from '../firebase';

import { MdAddCircle } from 'react-icons/lib/md';



class Friend extends Component {

  constructor(props){
    super(props)
    this.state={  addFriendComponent:null,
                  friendList:null,
                  invitedFriendList:null,
                  incomingInvitationList:null
              };
  }




  closeAddFriendPopup = () => {
    this.setState ({addFriendComponent : null});
  }

  ShowAddFriendItem(){
    const getFriendEntry = () => (
      <FriendEntry closeAddFriendPopupClick = {this.closeAddFriendPopup}/>
    );

    this.setState ({addFriendComponent : getFriendEntry()});
  }

  render(){
    // const friendList = this.state.friendList;
    // const friendListItemDetail = getFriendList();

    return (<div>
                <div>
                  <div  className="form-inline">
                    <div className="form-group">Arkadaşlarım </div> <MdAddCircle size={32}  style={{cursor: 'pointer'}} color="green"  onClick={()=> this.ShowAddFriendItem()}/>
                  </div>                  
                  
                  {this.state.addFriendComponent}
                  <hr/>
                  <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="Arkadaşlarım">
                      <FriendList/>
                    </Tab>
                    <Tab eventKey={2} title="Davet gönderdiklerim">
                      <FriendInvitedList/>
                    </Tab>
                    <Tab eventKey={3} title="Bana gelen davetler">
                      <FriendIncomingInvitationList/>
                    </Tab>                    
                  </Tabs>                
                  
                </div>
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


export default connect(mapStateToProps, null)(Friend);