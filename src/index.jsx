import React from "react";
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import List from "./list.jsx";
import UserInfo from "./userInfo.jsx";
import DestInfo from "./destInfo.jsx";
import Button from "react-bootstrap/Button";
import Itinerary from "./itinerary.jsx";
import Dialog from "./dialog.jsx";

// https://material-ui.com/zh/
class App extends React.Component {

    constructor (props) {
      super(props);
      this.state = {
          generate: false,
          destinations: [
            "Duder",
            "BBB",
            "GGBL",
          ],
      }

      this.handleGenerate = this.handleGenerate.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
      this.handleRemove = this.handleRemove.bind(this);
    }

    handleUpdate (new_list){
        console.log("Updating the destination list...");
        this.setState({
            destinations: new_list,
        })
    }

    handleRemove (idx){
        let previous = this.state.destinations;
        const removed = previous.splice(idx,1);

        console.log("Removing...");
        console.log(removed);
        this.setState({
            destinations: previous,
        }
        );
    }

    handleGenerate (){
        this.setState({
            generate: true,
        });
    }

    renderItinerary (){
        if (this.state.generate){
            return (
                <div>
                    <Itinerary
                    destinations={this.state.destinations} />
                    <br></br>
                    <Button type="button" className="btn btn-primary" onClick={()=>this.handleGenerate()}>Regenerate my travel itinerary!</Button>
                </div>
            );
        }
        else {
            return (
                <Button type="button" className="btn btn-primary" onClick={()=>this.handleGenerate()}>Generate my travel itinerary!</Button>
            )
        }
    }

    render () {
        return (
            <div>
            <Container>
                <h1>Conversational Travel Agent</h1>
            <Row>
                <UserInfo />
            </Row>
            
            <Row>
                <List 
                destinations={this.state.destinations}
                handleRemove = {this.handleRemove}/>
            </Row>
            <br></br>
            <Row>
                <Col>
                <DestInfo />
                </Col>

                <Col>
                <Dialog 
                handleUpdate={this.handleUpdate}/>
                </Col>
            </Row>
            <br></br>
            <Row className="justify-content-md-center">
            <Col>
            {this.renderItinerary()}
            </Col>
            </Row>
            </Container>
            </div>
        );
    }

    
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));