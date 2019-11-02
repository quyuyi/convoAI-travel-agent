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
      }

      this.handleGenerate = this.handleGenerate.bind(this);
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
                    <Itinerary />
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
                <List />
            </Row>
            <br></br>
            <Row>
                <Col>
                <DestInfo />
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