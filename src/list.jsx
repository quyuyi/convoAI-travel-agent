import React from "react";
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Tooltip from '@material-ui/core/Tooltip';

class List extends React.Component {
    constructor (props){
        super(props);
        this.state= {
            destinations: [
                "Duder",
                "BBB",
                "GGBL",
            ],
        };

        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);

    }

    componentDidMount (){
    }

    handleAdd (){
        const newDest = document.getElementById("myInput").value;
        document.getElementById("myInput").value = "";
        const previous = this.state.destinations;

        console.log("Adding a new destination list...");
        console.log(newDest);
        this.setState({
            destinations: [...previous, newDest],
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

    render (){
        return (
            <div>
            <div id="myDIV" class="header">
            <h2>Destinations</h2>
            <span>
            {/* <input type="text" id="myInput" placeholder="Place..."/>
            <Button variant="secondary" onClick={()=>this.handleAdd()} className="addBtn">Add</Button> */}
            </span>
            </div>


            <ul class="list-group list-group-flush">
            <div className='destinations'>
                    {this.state.destinations.map((h,idx) => {
                        return (
                            <div key={idx}>
                                <li class="list-group-item">
                                <span onClick = {()=>this.handleRemove()}>
                                <Tooltip title = "delete">
                                <HighlightOffIcon />
                                </Tooltip>
                                </span>
                                {h}
                                </li>    
                            </div>
                        )
                    })}
            </div>
            </ul>


            </div>
        );
    }
}

export default List;