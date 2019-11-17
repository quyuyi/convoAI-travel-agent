import React from "react";
import Button from "react-bootstrap/Button";
import MaterialTable from 'material-table';
import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';

// https://material-ui.com/zh/components/tables/
// get destinations list from list.jsx

// TODO
// Do we need to enable deleting in the itinery?
// Or it's enough to delete in destinaiton list and synchronize the itinerary?

// TODO
// Better display itinerary?


// const sample_props = [
//   [
//     {'name': 'place1',
//     'coordinates': {'latitude': '-122.40060084672637', 'longitude': '37.80337168883928'}},
//     {'name': 'place2',
//     'coordinates': {'latitude': '-122.49051199129258', 'longitude': '37.29931950915626'}},
//     {'name': 'place3',
//     'coordinates': {'latitude': '-122.31851199129268', 'longitude': '37.79931950915616'}}
//   ],
//   [
//     {'name': 'place4',
//     'coordinates': {'latitude': '-122.42060584673637', 'longitude': '37.80337168873928'}},
//     {'name': 'place5',
//     'coordinates': {'latitude': '-122.21851199121258', 'longitude': '37.79931950905626'}},
//   ]
  
//   // [
//   //   {'name': 'Newbury Street', 
//   //   'coordinates': {'latitude': '42.34916666666667', 'longitude': '-71.08416666666666'}},
//   //   {'name': 'Veggie Galaxy',
//   //   'coordinates': {'latitude': '42.3636635', 'longitude': '-71.1011293'}},
//   // ],
//   // [
//   //   {'name': 'Liberty Hotel', 
//   //   'coordinates': {'latitude': '42.36208408084301', 'longitude': '-71.07024616922506'}},
//   //   {'name': 'Stadium',
//   //   'coordinates': {'latitude': '42.348333333333336', 'longitude': '-71.08083333333333'}},
//   //   {'name': 'Ocean Prime',
//   //   'coordinates': {'latitude': '42.35121985162622', 'longitude': '-71.04348767362461'}}
//   // ]
// ];
class Itinerary extends React.Component {

    constructor (props) {
      super(props);
      console.log("print props for itinerary...")
      console.log(this.props);
      var coords = []
      var destinations = []
      this.props.schedule.map((day, index) => {
        day.map((dest, idx) => {
          console.log(dest.name);
          const coord = [dest.coordinates.latitude, dest.coordinates.longitude];
          coords.push(coord);
          destinations.push(dest.name);
        })

      })
      this.state = {
        // coords: [['-122.42060584672637', '37.80337168883928'], ['-122.41851199129258', '37.79931950915626']],
        coords: coords,
        destinations: destinations,
      };
      console.log(this.state.coords);
    }


    componentDidMount (){
      // Add your Mapbox access token
      mapboxgl.accessToken = 'pk.eyJ1IjoibHVib3VtaWNoIiwiYSI6ImNrMm5vdWRlODB2M3kzY205aTNwdTMxb2gifQ.Ax7uNaNJhLQVn00dJev4TA';
      var map = new mapboxgl.Map({
        container: 'map', // Specify the container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Specify which map style to use
        center: ['-122.42060584672637', '37.80337168883928'], // Specify the starting position
        zoom: 14.5, // Specify the starting zoom
      });

      // get coords list from this.props.
      this.props.map((day, idx) => {
        updateRoute(map, day, idx);
      });
    }

    handleGenerate(){
      console.log("handle regenerate need implementation...");
    }


  


    render(){
      let d = [];
      ['place1','place2','place3'].map((day, index)=> {
        let record = {
          'day': index+1,
          'destination': day,
          // 'description': 'https://caennews.engin.umich.edu/wp-content/uploads/sites/304/2017/05/ggbl2505-article-300x231.jpg'
        };
        d.push(record);
      });
        const columns = [
            { title: 'Day', field: 'day' },
            { title: 'Destination', field: 'destination' },
            // { title: 'Description', field: 'description',
            // render: rowData => <img src = {rowData.description} 
            //                       style = {{width:200}}/>
            // },
        ];
        const data = d;
      return(
      <div>
        <MaterialTable
          title="itinerary"
          columns={columns}
          data={data}
        />
        <Button type="button" className="btn btn-primary" onClick={()=>this.handleGenerate()}>Regenerate my travel itinerary!</Button>
      </div>
      );
    }

}



function updateRoute(map, coords, i) {
  // Set the profile
  // var profile = "driving";
  var profile = "driving-traffic";
  // Get the coordinates that were drawn on the map


  //var data = draw.getAll();
  //var lastFeature = data.features.length - 1;
  //var coords = data.features[lastFeature].geometry.coordinates;
  //console.log(coords);
  
  // format the record in our database
  let format_coords = [];
  coords.map((dest, idx) => {
    let coord = [dest.coordinates.latitude, dest.coordinates.longitude];
    format_coords.push(coord);
  })
  coords = format_coords;
  // Format the coordinates
  var newCoords = coords.join(';')
 // console.log(newCoords);


  // Set the radius for each coordinate pair to 25 meters
  var radius = [];
  coords.forEach(element => {
    radius.push(25);
  });
  getMatch(map, newCoords, radius, profile, i);
}





    
function getMatch(map, coordinates, radius, profile, i) {
  console.log("print from getMatch...")
  console.log(coordinates);
  // Separate the radiuses with semicolons
  var radiuses = radius.join(';')
  // Create the query
  let query = 'https://api.mapbox.com/matching/v5/mapbox/' + profile + '/' + coordinates + '?geometries=geojson&radiuses=' + radiuses + '&steps=true&access_token=' + mapboxgl.accessToken;

  $.ajax({
    method: 'GET',
    url: query
  }).done(function(data) {
    console.log(data);
    // Get the coordinates from the response
    let coords = data.matchings[0].geometry;
    // Draw the route on the map
    addRoute(map, coords, i);
    getInstructions(data.matchings[0]);
  });
}






// If the user clicks the delete draw button, remove the layer if it exists
function removeRoute() {
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeSource('route');
  } else {
    return;
  }
}






function addRoute(map, coords, idx) {
  // If a route is already loaded, remove it
  // if (map.getSource('route')) {
  //   map.removeLayer('route')
  //   map.removeSource('route')
  // } else {
    const colors= ["#03AA46", "#FF0000"];
    const name = "route"+idx.toString();
    console.log(name);
    map.addLayer({
      "id": name,
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": coords
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": colors[idx],
        "line-width": 8,
        "line-opacity": 0.8
      }
    });

    let feats = [];
    console.log(coords.coordinates);
    for (let i = 0; i < coords.coordinates.length; ++i) {
      let item = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": coords.coordinates[i].map(i => parseFloat(i))
        },
        "properties": {
          "title": 'destination_name',
          "icon": "monument"
        }
      }
      feats.push(item);
    }

    map.addLayer({
    "id": "points"+idx.toString(),
    "type": "symbol",
    "source": {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features": feats
      }
    },
    "layout": {
      // get the icon name from the source's "icon" property
      // concatenate the name to get an icon from the style's sprite sheet
      "icon-image": ["concat", ["get", "icon"], "-15"],
      // get the title name from the source's "title" property
      "text-field": ["get", "title"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-offset": [0, 0.6],
      "text-anchor": "top"
    }
    });


  // };
}







function getInstructions(data) {
  // Target the sidebar to add the instructions
  var directions = document.getElementById('directions');

  var legs = data.legs;
  var tripDirections = [];
  // Output the instructions for each step of each leg in the response object
  for (var i = 0; i < legs.length; i++) {
    var steps = legs[i].steps;
    for (var j = 0; j < steps.length; j++) {
      tripDirections.push('<br><li>' + steps[j].maneuver.instruction) + '</li>';
    }
  }
  directions.innerHTML = '<br><h5>Trip duration: ' + Math.floor(data.duration / 60) + ' min.</h5>' + tripDirections;
}


export default Itinerary;




