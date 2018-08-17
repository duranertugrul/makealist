import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import {connect} from 'react-redux';
import {firebaseApp}  from '../firebase';

class SharedIncomingList extends Component {

  constructor(props){
    super(props)
    this.state = {list :null}
  }
  componentDidMount() {
    const { userId } = this.props.user;
    const listRef = firebaseApp.database().ref(userId + '/IncomingListHeader');
    let list = null;
    listRef
    .orderByChild('status')
    .equalTo('waiting') 
    .on("value", snap => {

        list = [];
        snap.forEach(item => {
            const {listHeader, listHeaderId, email, userId, status, sentListkey} = item.val();
            const invitedListKey = item.key;
            list.push({listHeader, listHeaderId, email, userId, status, invitedListKey, sentListkey});
        });

        list = list.length == 0 ? null: list;

        this.setState({list});
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  onClickUpdateItemStatus = (item) =>{
    let { userId } = this.props.user;
    const {listHeader,   invitedListKey, sentListkey, listHeaderId} = item;
    const fromUserId = item.userId;
    const fromEmail = item.email;
     

    const status = 'active'; 
    let updates = {};
    updates['status'] = 'active';
    // talep eden kullanıcının 
    firebaseApp.database().ref(fromUserId +'/SentListHeader/' + sentListkey).update(updates);

    // talep edilen işlem
    firebaseApp.database().ref(userId +  '/IncomingListHeader/' + invitedListKey).update(updates);
    
    
    const relatedListHeaderKeyFrom = firebaseApp.database().ref(fromUserId  + '/SharedList').
            push({listHeader,  status, userId, invitedListKey, sentListkey, relatedFriendKey: null, listHeaderId:null}).key;
  
    // const relatedListHeaderKey =firebaseApp.database().ref(userId + '/SharedList').push({
    //                 listHeader, email :fromEmail, status, userId: fromUserId, invitedListKey,  
    //                 sentListkey, relatedFriendKey: relatedListHeaderKeyFrom,listHeaderId:null}).key;

    // let friendUpdates = {};
    // friendUpdates['relatedFriendKey'] = relatedListHeaderKey;    
    // firebaseApp.database().ref(fromUserId + '/SharedList/' + relatedListHeaderKey).update(friendUpdates);                    
    this.copyListDetail(fromUserId, listHeader, listHeaderId, userId, relatedListHeaderKeyFrom )
  }

  copyListDetail =(fromUserId, listHeader, listHeaderId, ToUserId, sharedListFromId )=>{
    const listRef = firebaseApp.database().ref(fromUserId + '/ListDetail/' + listHeaderId);
    let list = null;
    listRef
    .on("value", snap => {

        list = [];
        snap.forEach(item => {
            const {itemName, itemCategory,  itemStatus} = item.val();
            const invitedListKey = item.key;
            list.push({itemName, itemCategory,  itemStatus, invitedListKey});
        });

        list = list.length == 0 ? null: list;

        this.pasteListDetail(fromUserId, ToUserId, listHeader, list, sharedListFromId);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  pasteListDetail = (fromUserId, toUserId, listHeader, list, sharedListFromId) =>{

    const headerKey = firebaseApp.database().ref(toUserId + '/ListHeader').push(listHeader).key;        
    
    list & list.forEach(item => {
        const {itemName, itemCategory,  itemStatus} = item;
        firebaseApp.database().ref(toUserId + '/ListDetail/' + headerKey )
            .push({ itemName, itemCategory,  itemStatus});        
    });

    let updates = {};
    updates['listHeaderId'] = headerKey;    
    firebaseApp.database().ref(fromUserId + '/SharedList/' + sharedListFromId).update(updates);  
    // firebaseApp.database().ref(toUserId + '/SharedList/' + sharedListToId).update(updates);                    
  }
  
  

  onClickDeleteItem = (item) => {
    const {listHeader, email,  invitedListKey, sentListkey} = item;
    const invitedUserId = item.userId;
    const { userId } = this.props.user;
    firebaseApp.database().ref(userId +'/SentListHeader/' + sentListkey).remove();
    firebaseApp.database().ref(invitedUserId +  '/IncomingListHeader/' + invitedListKey).remove();
  }

  render(){
    const list = this.state.list;
    
    let listItemDetail =  list && list.sort((a, b) => a.listHeader > b.listHeader)
                        .map((item, index) =>
                        <div key = {index} style={{margin: '5px'}}>
                          <strong>{item.listHeader}</strong>
                          <strong style={{margin: '5px'}}>{item.email}</strong>
                          <Button onClick={()=>this.onClickUpdateItemStatus(item)} bsStyle="success">&#x2714;</Button>
                          <Button onClick={()=>this.onClickDeleteItem(item)} bsStyle="danger">&#x2715;</Button>
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
    const {user } = state
    return {
      user
    }
  }
  

export default connect(mapStateToProps, null)(SharedIncomingList);