import React from "react";
import ReactDOM from 'react-dom';

class App extends React.Component {

    constructor (props) {
      super(props);
    }

    render () {
        return (
            <div>
                <p>Dumb travel planner</p>
            </div>
        );
    }

    
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));