import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LogTable from '../../syslog/LogTable.js'

class ViewLog extends Component {
  constructor(props) {
    super(props);
    
}

  render() {
    return (
      <div className="container">
        <header>
          <h1>Global Log</h1>
        </header>
        <p></p>
        <LogTable />
      </div>
    );
  }
}

export default ViewLog;





