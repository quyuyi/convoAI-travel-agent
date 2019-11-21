import React from "react";
import Button from '@material-ui/core/Button';

class DestInfo extends React.Component {

    constructor (props) {
        super(props);
        this.state = {"destination": ""}
    }
    
    postData(url = '', data = {}) {
        // Default options are marked with *
            return fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrer: 'no-referrer', // no-referrer, *client
                body: JSON.stringify(data), // body data type must match "Content-Type" header
            })
            .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    componentDidMount() {
        // Call REST API to get number of likes
        this.setState({"destination": document.getElementById("destination-name").innerHTML, user_id: this.props.userId});
    }
    
    // TODO
    handleAdd = () => {
        console.log("click on button");
        let data = {destination: document.getElementById("destination-name").innerHTML, user_id: this.props.userId}
        console.log(data)
        this.postData('/add_destination/', data) 
        .then(dat => {
            // console.log("get reponse: ", data.response);
            console.log("data", dat);
            this.props.handleUpdate('destinations', dat.destinations);
        }) // JSON-string from `response.json()` call
        .catch(error => console.error(error));
    }
    
    render () {
        return (
            <div className="destination-details">
                <div className="destination-img-container">
                    <img id="destination-img" src="/static/img/NCRB.JPG" />
                </div>  
                <h2 id="destination-name">NCRB</h2>  
                 <p id="destination-intro">
                     University of Michigan - NCRB, Ann Arbor
                 </p>
                 <Button type ="button" onClick={this.handleAdd} size="small" color="primary">
                    Add
                 </Button>
            </div>
        );
    }
}

export default DestInfo;
