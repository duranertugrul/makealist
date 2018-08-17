import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {connect} from 'react-redux';
// import Back  from "Back";
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import SlideMenu from 'react-slide-menu'

import ListHeader from './ListHeader';
import ListDetail from './ListDetail';
import Friend from './Friend';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Share from './Share';
import {firebaseApp} from '../firebase';
import createBrowserHistory from 'history/createBrowserHistory';
import { LastLocationProvider } from "react-router-last-location";
import Back  from "./Back";



class App extends Component {

  constructor(props){
    super(props)
  }

  componentDidMount(){
    var user = firebaseApp.auth().currentUser;

    if (!user) {
        this.props.history.push("/signin");
    }
  }  

  SignOutFromApp(){
    firebaseApp.auth().signOut();
    this.props.history.push("/signin");
    // alert("SignOutFromApp");
  }



  render(){
    return (<Router >
                <LastLocationProvider>{/* <---- Put provider inside <Router> */}
                    <div style={{ display: "flex" }}>
                        <div
                            style={{
                            padding: "10px",
                            width: "40%",
                            background: "#f0f0f0"
                            }}
                        >    
                        <ListGroup>
                            <LinkContainer to="/listheader"><ListGroupItem>Liste Başlıkları</ListGroupItem></LinkContainer>
                            <LinkContainer to="/friend"><ListGroupItem>Arkadaşlarım</ListGroupItem></LinkContainer>
                            <LinkContainer to="/share"><ListGroupItem>Ortak Listeler</ListGroupItem></LinkContainer>
                            <ListGroupItem onClick= {()=>this.SignOutFromApp()}>Sign Out</ListGroupItem>
                        </ListGroup>
                        </div>
                        
                        <div style={{ flex: 1, padding: "10px" }}>
                            
                            <div>
                                <Route path="/listheader" component={ListHeader} history={createBrowserHistory}/>
                                <Route path="/friend" component={Friend} />
                                <Route path="/signin" component={SignIn} />
                                <Route path="/signup" component={SignUp} />
                                <Route path="/share" component={Share} history={createBrowserHistory} />
                                <Route path="/listdetail/:menuId/:uid?" component={ListDetail} history={createBrowserHistory} />
                            </div>
                        </div>                
                    </div>
                </LastLocationProvider>
            </Router>);
  }
}

function mapStateToProps(state) {
    const { user } = state;
    return {
      user
    }
  }
  
export default connect(mapStateToProps, null)(App);

