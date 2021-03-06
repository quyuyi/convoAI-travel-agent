import React from "react";
import Button from '@material-ui/core/Button';

class DestInfo extends React.Component {

    constructor (props) {
        super(props);
        this.state = {"destination": ""}
    }
    
    componentDidMount() {
        // Call REST API to get number of likes
        this.setState({"destination": document.getElementById("destination-name").innerHTML, user_id: this.props.userId});
    }
    
    render () {
        return (
            <div className="destination-details">
                <div className="destination-img-container">
                    <img id="destination-img" src="/static/img/jason.jpg" />
                </div>  
                <h2 id="destination-name">Hi, I'm your traveling assistant Jason. How can I help you?</h2>  
                 <p id="destination-intro">
                     
                 </p>
                 <span onClick={() => this.props.addDestination()} className="destination-add">Add</span>
                 <span onClick={() => this.props.skipDestination()} className="destination-skip">Next</span>
            </div>
        );
    }
}

export default DestInfo;
