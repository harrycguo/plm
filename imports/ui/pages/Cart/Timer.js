import React, { Component } from 'react';

class Timer extends Component {

    constructor(props) {
		super(props);

		this.state = {
			totalCost: Number(0),
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
          return <p><b>Time of Checkout: </b> {this.state.currTime}</p>
      }
    }

export default Timer
