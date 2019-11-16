import React from "react";
import Button from 'react-bootstrap/Button';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import PlaceIcon from '@material-ui/icons/Place';

class List extends React.Component {
    constructor (props){
        super(props);
        // this.state= {
        //     destinations: [
        //         "Duder",
        //         "BBB",
        //         "GGBL",
        //     ],
        // };

        // this.handleAdd = this.handleAdd.bind(this);
        // this.handleRemove = this.handleRemove.bind(this);

    }

    componentDidMount (){
    }

    // handleAdd (){
    //     const newDest = document.getElementById("myInput").value;
    //     document.getElementById("myInput").value = "";
    //     const previous = this.state.destinations;

    //     console.log("Adding a new destination list...");
    //     console.log(newDest);
    //     this.setState({
    //         destinations: [...previous, newDest],
    //     })
    // }

    // handleRemove (idx){
    //     let previous = this.state.destinations;
    //     const removed = previous.splice(idx,1);

    //     console.log("Removing...");
    //     console.log(removed);
    //     this.setState({
    //         destinations: previous,
    //     }
    //     );
    // }

    render (){
        // console.log(this.props.destinations);
        return(
            <div>
                {this.props.destinations.map((value, index) => {
                    return (
                        <Chip key={index} 
                        icon={<PlaceIcon />}
                        color="default" 
                        label = {value} 
                        onDelete={()=>this.props.handleRemove(index)}
                        deleteIcon={<HighlightOffIcon />}
                        variant="outlined" />
                    )
                })}
            </div>
        );
    }
}

export default List;