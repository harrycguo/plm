import React, { Component } from 'react';
import { Link } from 'react-router-dom';
 
// App component - represents the whole app
class Index extends Component {
  constructor(props) {
    super(props);
    console.log("User = ")
    console.log(Meteor.user());
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Welcome to Production Lifecycle Management Tool!</h1>
        </header>
        <p>Pick an option below</p>
      <ul>
        <li><Link to='/login'>Login</Link></li>
      </ul>
        <footer>
          <p>Dope veggies bro</p>
          </footer>
          
      </div>
    );
  }
}

export default Index;





