import React, {Component} from 'react'
import {Link,Redirect} from 'react-router-dom';
import {firebaseApp} from '../firebase';
import {connect} from 'react-redux';
import {logUser, setFriendList} from '../actions';

class SignIn extends Component{
  constructor(props){
    super(props);
    this.state = {
      email:'',
      password:'',
      error :{
        message:''
      },
      redirectToReferrer:false
    }
  }

  signIn(){

    console.log('this.state', this.state);
    const {email, password} = this.state;
    
    firebaseApp.auth().signInWithEmailAndPassword(email, password).
    then(() => {
        var user = firebaseApp.auth().currentUser;
        this.props.logUser(email, user.uid);
        this.FillFriendList(user.uid);
    }).catch(error => {
        this.setState({error});
    });
  }

  FillFriendList = (userId) =>{
    // const { userId } = this.props.user;
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

        this.props.setFriendList({list});
        this.setState({redirectToReferrer: true});
        
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });    
  }



  render(){
    const {redirectToReferrer, email} = this.state;

    return (
      <div className="form-inline" style={{margin:'5%'}}>
        {redirectToReferrer && (
          <Redirect to={'/'}/>
        )}
        <h2>Sign In</h2>
        <div className="form-group">
          <input type="text"
            className="form-control"
            placeholder="email"
            style={{marginRight:'5px'}}
            onChange ={event => this.setState({email:event.target.value})} />
            <input type="password"
              className="form-control"
              placeholder="password"
              style={{marginRight:'5px'}}
              onChange ={event => this.setState({password:event.target.value})}/>
            <button className="btn btn-primary"
              type="button"
              onClick={()=>this.signIn()}>
              Sign In
            </button>
        </div>
        <div>{this.state.error.message}</div>
        <div><Link to={'/signup'}>Sign Up instead</Link></div>
      </div>
    )
  }
}


function mapStateToProps(state) {
    return {}
}
  
export default connect(mapStateToProps, {logUser, setFriendList})(SignIn);