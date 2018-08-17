import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';

import {firebaseApp }  from '../firebase';


class ListDetailEntry extends Component {
  constructor(props){
      super(props)
      this.state = { itemName: '',
                    listName : '',
                    itemCategory : ''}
  }

  addItemToList(){
    //this.props.addItemToList(this.state.listName, this.state.itemName);

    // console.log('this', this);
    const { itemName, itemCategory} = this.state;
    const { email, userId } = this.props.user;
    const itemStatus = 'A';
    firebaseApp.database().ref(userId + '/ListDetail/' + this.props.listHeaderKey).push({ itemName, itemCategory, itemStatus});
    this.setState({itemName:'', itemCategory :'', itemPlace:''});      
  }

  render(){
    return (<div className="form-inline">
              <div className="form-group" >
                      <input
                        type="text"
                        placeholder="Yeni madde"
                        className="form-control"
                        style={{marginRight: '5px'}}
                        onChange={event => this.setState({itemName: event.target.value})}
                        value={this.state.itemName}
                      />
                      <input
                        type="text"
                        placeholder="Kategorisi"
                        className="form-control"
                        style={{marginRight: '5px'}}
                        onChange={event => this.setState({itemCategory: event.target.value})}
                        value={this.state.itemCategory}
                      />
                      <Button
                        className="btn btn-success"
                        type="button"
                        onClick={() => this.addItemToList()}
                      >
                        Add to list
                      </Button>
              </div>
            </div>);
  }
}


function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default connect(mapStateToProps, null)(ListDetailEntry);