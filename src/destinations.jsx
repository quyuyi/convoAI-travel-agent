import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

class Destinations extends Component {
  constructor (props) {
      super(props);
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  onDragEnd = (result) => {
    if (!result.destination) {
        return;
    }
    const destinations = this.reorder(
        this.props.destinations,
        result.source.index,
        result.destination.index
    );
    this.props.reorderDestinations(destinations);
  }


  render () {
    let count = Math.ceil(this.props.destinations.length / this.props.tripLength);
    let day = 1;
    let indexer = 1;
    return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="destinations-list-items"
              >
                {this.props.destinations.map((dest, index) => (
                  <React.Fragment>
                    { 
                      index % count === 0 ? (<h5 style={{display: day >= this.props.destinations.length / count + 1 ? 'none' : 'block' }} 
                                                key={indexer++ * 7} className="dest-day">Day {day++}</h5>) : '' 
                    }
                    <Draggable key={index} draggableId={`dest-${index}`} index={index}>
                    
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="dest-item"
                      >
                        {dest}
                        <span onClick={() => this.props.removeDestination(index)}>x</span>
                      </div>
                    )}
                    </Draggable>
                  </React.Fragment>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
    );
  }
}

export default Destinations;
