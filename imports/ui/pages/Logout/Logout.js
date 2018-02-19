import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

class Logout extends React.Component {
  
    componentDidMount() {
      Meteor.logout();
    }

    render() {
        return (
          <div className="container">
            <header>
                <h1>Logged out!</h1> 
            </header>

            <li><Link to='/login'>Login</Link></li>
          </div>
        );
      }
    }
    
Logout.propTypes = {};
    
export default Logout;