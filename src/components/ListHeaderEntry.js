import React, { Component } from 'react';
import {connect} from 'react-redux';
// import {makeANewList} from '../actions';
import {firebaseApp }  from '../firebase';


class ListHeaderEntry extends Component {

  constructor(props){
    super(props)
    this.state = {listName :''}
  }

  makeANewList() {
    console.log('this', this);
    const { listName } = this.state;
    const { email, userId } = this.props.user;

    firebaseApp.database().ref(userId + '/ListHeader').push(listName);
    //firebaseApp.database().ref('ListHeader').push(listName);

    this.setState({listName:''});    
  }

  render(){
    return (<div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        placeholder="Make a new list"
                        className="form-control"
                        style={{marginRight: '5px'}}
                        onChange={event => this.setState({listName: event.target.value})}
                        value={this.state.listName}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-success"
                        type="button"
                        onClick={() => this.makeANewList()}
                      >
                        Make a new list
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>);
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default connect(mapStateToProps, null)(ListHeaderEntry);
