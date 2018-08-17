import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Button, Tabs, Tab} from 'react-bootstrap';
import FriendEntry from './FriendEntry';

import FriendList from './FriendList';
import FriendInvitedList from './FriendInvitedList';
import FriendIncomingInvitationList from './FriendIncomingInvitationList';

import {firebaseApp}  from '../firebase';

import { MdAddCircle } from 'react-icons/lib/md';

import SharedList  from './SharedList';
import SharedSentList  from './SharedSentList';
import SharedIncomingList from './SharedIncomingList';



class Share extends Component {

  constructor(props){
    super(props)
  }
  
  render(){
    return (<div>
                <div>
                  <div  className="form-inline">
                    <div className="form-group">Paylaşımlı Listeler </div>
                  </div>                  
                  <hr/>
                  <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="Ortak Listeler">
                      <SharedList history={this.props.history}/>
                    </Tab>
                    <Tab eventKey={2} title="Gönderdiğim Onay Bekleyen Listeler">
                      <SharedSentList/>
                    </Tab>
                    <Tab eventKey={3} title="Bana Gelen Listeler">
                      <SharedIncomingList/>
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


export default connect(mapStateToProps, null)(Share);