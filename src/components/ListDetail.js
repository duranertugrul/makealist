import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Table, Button} from 'react-bootstrap';

import ListDetailEntry from './ListDetailEntry';
import {firebaseApp}  from '../firebase';
import Back  from "./Back";

class ListDetail extends Component {
  constructor(props)
  {
    super(props);
    this.state={list:null,
                listDisabled:false};
  }
  
  componentDidMount() {
    let { userId } = this.props.user;
    const uid = this.props.match.params.uid;
    userId = uid ? uid: userId
    const listDisabled = uid ? true:false;
   
    const listHeaderRef = firebaseApp.database().ref(userId + '/ListDetail/' + this.props.match.params.menuId);
    let listHeaderArray = null;
    listHeaderRef.on("value", snap => {

      listHeaderArray = [];
      snap.forEach(listHeader => {
        const {itemName, itemCategory,  itemStatus} = listHeader.val();
        const serverKey = listHeader.key;
        listHeaderArray.push({ itemName, itemCategory,  itemStatus, serverKey });
      })
      listHeaderArray = listHeaderArray.length == 0 ? null: listHeaderArray;
      // this.props.setListHeaders(listHeaderArray);  
       this.setState({list:listHeaderArray, listDisabled});
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  onClickUpdateItemStatus(itemKey){

    const { email, userId } = this.props.user;
    // const itemStatus = 'P'; 
    let updates = {};
    updates['itemStatus'] = 'P'
    
    firebaseApp.database().ref(userId + '/ListDetail/' + this.props.match.params.menuId +'/' + itemKey).update(updates);
  } 
  
  onClickDeleteItem(itemKey, deletedItemName){

    const { email, userId } = this.props.user;
    firebaseApp.database().ref(userId + '/ListDetail/' + this.props.match.params.menuId).child(itemKey).remove();
  }    
  
  
  CreateGridFromList=() =>
  {
    const itemList = this.state.list;
 
    let itemListResult = itemList && itemList.sort((a, b) => a.itemCategory > b.itemCategory & a.itemName > b.itemName)
                    .map((item, index) =>

                        item.itemStatus === 'A' ? 
                                    <tr>
                                        <td>{item.itemName}</td>
                                        <td>{item.itemCategory}</td>
                                        <td><Button disabled={this.state.listDisabled} onClick={()=>this.onClickUpdateItemStatus(item.serverKey, item.listName)} bsStyle="success">&#x2714;</Button></td>
                                    </tr>
                              : 
                                    <tr>
                                        <td><del>{item.itemName}</del></td>
                                        <td><del>{item.itemCategory}</del></td>
                                        <td><Button disabled={this.state.listDisabled} onClick={()=>this.onClickDeleteItem(item.serverKey, item.listName)} bsStyle="danger">&#x2715;</Button></td>
                                    </tr>
                      );
                      
    if (itemListResult)
    {
      itemListResult = <Table striped bordered condensed hover responsive>
                          <thead>
                            <tr>
                              <td>Adı</td>
                              <td>Kategori</td>
                              <td>İşlem</td>
                            </tr>
                          </thead>
                          <tbody>
                            {itemListResult}
                          </tbody>
                        </Table>

    }
    return itemListResult;
  }

  render(){
    // alert(this.props.match.params.menuId);
    const itemList = this.state.list;
 
    const itemListResult = this.CreateGridFromList();

    
    return ( <div>
              <Back/>
              <hr/>              
              <ListDetailEntry listHeaderKey={this.props.match.params.menuId}/>
              <hr/>
              {itemList  ? itemListResult : 'Listeniz Bulunmamaktadır.'}
            </div>);
  }
}


function mapStateToProps(state) {
  const {listheaders, user } = state
  console.log(state);
  return {
    list :listheaders,
    user
  }
}


export default connect(mapStateToProps, null)(ListDetail);
