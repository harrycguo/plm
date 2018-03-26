import React, { Component } from 'react';

class Timer extends Component {

    constructor(props) {
		super(props);

			this.state = {
				currTime: null
			}
		}

    componentDidMount() {
			setInterval( () => {
				this.setState({
				currTime : new Date().toLocaleString()
				})
			},1000)
    }
      
      render() {
          return <p><b>Current Time: </b> {this.state.currTime}</p>
      }
    }

export default Timer
