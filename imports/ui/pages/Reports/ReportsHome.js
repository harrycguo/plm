import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import ReportsNavBar from '../../components/ReportsNavBar/ReportsNavBar.js'

class ReportsHome extends Component {
  constructor(props) {
    super(props);
}

  render() {
    return (
      <div className="container">
        <header>
          <h1>View Reports</h1>
        </header>
        <ReportsNavBar />
      </div>
    );
  }
}

export default ReportsHome;





