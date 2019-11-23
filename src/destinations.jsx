import React, { Component } from "react";
import Button from '@material-ui/core/Button';

class Destinations extends Component {
  constructor (props) {
      super(props);
      this.state = {"destination": ""}
  }
  // make list look nice, add remove button next each destination, possibly use ReactDND
  render () {
    return (
      <div className={this.props.show ? "destination-list" : "destination-list-hidden"}>
        <h1>Selected Destinations</h1>
        <ul>
          {
            this.props.destinations.map((idx, dest) => {
              return <li key={idx}>{dest.name}</li>
            })
          }
        </ul>
      </div>
    );
  }
}

export default Destinations;
