import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import {connect} from 'react-redux';
import {firebaseApp}  from '../firebase';

class SharedSentList extends Component {

  constructor(props){
    super(props)
    this.state = {list :null}
  }

  componentDidMount() {
    const { userId } = this.props.user;
    const listRef = firebaseApp.database().ref(userId + '/SharedList');
    let list = null;
    listRef
    .orderByChild('status')
    .equalTo('active') 
    .on("value", snap => {

        list = [];
        snap.forEach(item => {
            const {listHeader, listHeaderId, email, userId, status, invitedListKey} = item.val();
            const sentListkey = item.key;
            list.push({listHeader, listHeaderId, email, userId, status, invitedListKey, sentListkey});
        });

        list = list.length == 0 ? null: list;

        this.setState({list});
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  onClickLink(menuId, userId){
    this.props.history.push('/listdetail/' + menuId + '/' + userId);
  }

  onClickDeleteItem = (item) => {
    const {listHeader, listHeaderId, email,  invitedListKey, sentListkey} = item;
    const { userId } = this.props.user;

    let updates = {};
    updates['status'] = 'passive';
    firebaseApp.database().ref(userId + '/SharedList/' + sentListkey).update(updates);

  }

  render(){
    const list = this.state.list;
    
    let listItemDetail =  list && list.sort((a, b) => a.listHeader > b.listHeader)
                        .map((item, index) =>
                        <div key = {index} style={{margin: '5px'}}>
                        <Button onClick={()=>this.onClickLink(item.listHeaderId, item.userId)} bsStyle="info">...</Button>                     
                          <strong>{item.listHeader}</strong>
                          <strong style={{margin: '5px'}}>{item.email}</strong>
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
    console.log(state);
    return {
      user
    }
  }
  

export default connect(mapStateToProps, null)(SharedSentList);
