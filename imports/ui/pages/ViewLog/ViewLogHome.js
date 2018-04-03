import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LogNavBar from '../../components/LogNavBar/LogNavBar.js'

class ViewLogHome extends Component {
  constructor(props) {
    super(props);
    
}

  render() {
    return (
      <div className="container">
        <header>
            <h1>View Global Log</h1>
        </header>
        
        <LogNavBar />

      </div>
    );
  }
}

export default ViewLogHome;





