import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// App component - represents the whole app
class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Welcome to Production Lifecycle Management Tool!</h1>
        </header>
        <ul>
          <li><Link to='/login'>Login</Link></li>
        </ul>
      </div>
    );
  }
}

export default Index;





