import React from "react";
import MaterialTable from 'material-table';
import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';

// https://material-ui.com/zh/components/tables/
// get destinations list from list.jsx

// TODO
// Do we need to enable deleting in the itinery?
// Or it's enough to delete in destinaiton list and synchronize the itinerary?

// TODO
// Better display itinerary?

class Itinerary extends React.Component {

    constructor (props) {
      super(props);
      console.log(this.props);
    }


    componentDidMount (){

    }

    render (){
      let d = [];
      this.props.destinations.map((dest, index)=> {
        let record = {
          'day': index+1,
          'destination': dest,
          'description': 'https://caennews.engin.umich.edu/wp-content/uploads/sites/304/2017/05/ggbl2505-article-300x231.jpg'
        };
        d.push(record);
      });
        const columns = [
            { title: 'Day', field: 'day' },
            { title: 'Destination', field: 'destination' },
            { title: 'Description', field: 'description',
            render: rowData => <img src = {rowData.description} 
                                   style = {{width:200}}/>
            },
        ];
        const data = d;
        

        return (
            <MaterialTable
              title="itinerary"
              columns={columns}
              data={data}
              // editable={{
                // onRowUpdate: (newData, oldData) =>
                //   new Promise(resolve => {
                //     setTimeout(() => {
                //       resolve();
                //       if (oldData) {
                //         this.setState(prevState => {
                //           const data = [...prevState.data];
                //           data[data.indexOf(oldData)] = newData;
                //           return { ...prevState, data };
                //         });
                //       }
                //     }, 600);
                //   }),
                // onRowDelete: oldData =>
                //   new Promise(resolve => {
                //     setTimeout(() => {
                //       resolve();
                //       this.setState(prevState => {
                //         const data = [...prevState.data];
                //         data.splice(data.indexOf(oldData), 1);
                //         return { ...prevState, data };
                //       });
                //     }, 600);
                //   }),
              // }}
            />
        );
    }

}


export default Itinerary;