import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import ListHeaderEntry from './ListHeaderEntry';

import ShareListToFriend from './ShareListToFriend';
import {firebaseApp}  from '../firebase';
import {connect} from 'react-redux';
import { setListHeaders } from '../actions';
import { FaShareAlt } from 'react-icons/lib/fa';
import Popup from "reactjs-popup";


// import ListDetail from './ListDetail';

class ListHeader extends Component {
  constructor(props){
    super(props);
    this.state={
                list:null,
                shareListToFriend :false
              }
  }

  componentDidMount() {
    const { userId } = this.props.user;

    var user = firebaseApp.auth().currentUser;

    if (!user) {
        this.props.history.push("/");
    }

    const listHeaderRef = firebaseApp.database().ref(userId + '/ListHeader');
    let listHeaderArray = null;
    listHeaderRef.on("value", snap => {

      listHeaderArray = [];
      snap.forEach(listHeader => {
        const listName = listHeader.val();
        const serverKey = listHeader.key;
        listHeaderArray.push({ listName, serverKey });
      })
      
      this.setState({list:listHeaderArray});
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }


  onClickDeleteItem(menuId, menuName){

    const { email, userId } = this.props.user;
    firebaseApp.database().ref(userId + '/ListHeader').child(menuId).remove();
    firebaseApp.database().ref(userId + '/ListDetail').child(menuId).remove();

  }

  onClickShareItem(menuId, menuName){
    this.setState( {shareListToFriend :true} );
  }

  onClickLink(menuId){
    this.props.history.push('/listdetail/' + menuId);
  }

  CloseSharedItem(){
    this.setState( {shareListToFriend :false} );
  }

  render(){
    
    const headerList = this.state.list;
    
    let listItemDetail =  headerList && headerList.sort((a, b) => a.listName > b.listName)
                        .map((listItem, index) =>
                        <div key = {index} style={{margin: '5px'}}>
                          <Button onClick={()=>this.onClickLink(listItem.serverKey)} bsStyle="info">...</Button>
                          <strong>{listItem.listName}</strong>
                          <Button onClick={()=>this.onClickDeleteItem(listItem.serverKey, listItem.listName)} bsStyle="danger">&#x2715;</Button>
                          <Popup
                              trigger={<Button bsStyle="success"><FaShareAlt/></Button>}
                              modal
                            >      
                            {close => (<ShareListToFriend onClose = {close} listHeader = {listItem.listName} listHeaderId= {listItem.serverKey} />)}
                          </Popup>                                                
                          
                        </div>
                        );
    return (<div>
                <div>
                  <ListHeaderEntry/>
                  <hr/>
                  {headerList ? listItemDetail : 'Listeniz Bulunmamaktadır.'}
                </div>
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


export default connect(mapStateToProps, { setListHeaders })(ListHeader);
