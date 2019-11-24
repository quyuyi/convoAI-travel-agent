import React, { Component } from "react";
import Button from '@material-ui/core/Button';

class Destinations extends Component {
  constructor (props) {
      super(props);
      this.state = {"destination": ""}
  }  

  render () {
    return (
      <div className={this.props.show ? "destination-list" : "destination-list-hidden"}>
        <h1>Selected Destinations</h1>
        <ul className="destinations-list-items">
          {
            this.props.destinations.map((dest, idx) => {
              return (
                <li key={idx}>
                  {dest}
                  <span onClick={() => this.props.removeDestination(idx)}>x</span>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}

export default Destinations;
