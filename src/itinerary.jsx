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

class Itinerary extends React.Component {

    constructor (props) {
      super(props);
      this.state = {
        // coords: this.props.destinations,
        coords: [['-122.42060584672637', '37.80337168883928'], ['-122.41851199129258', '37.79931950915626']],
      };
      console.log(this.props);
    }


    componentDidMount (){
      // Add your Mapbox access token
      mapboxgl.accessToken = 'pk.eyJ1IjoibHVib3VtaWNoIiwiYSI6ImNrMm5vdWRlODB2M3kzY205aTNwdTMxb2gifQ.Ax7uNaNJhLQVn00dJev4TA';
      var map = new mapboxgl.Map({
        container: 'map', // Specify the container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Specify which map style to use
        center: [-122.42136449,37.80176523], // Specify the starting position
        zoom: 14.5, // Specify the starting zoom
      });
      updateRoute(map, this.state.coords);
    }



  


    render(){
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



function updateRoute(map, coords) {
  // Set the profile
  var profile = "driving";
  // Get the coordinates that were drawn on the map


  //var data = draw.getAll();
  //var lastFeature = data.features.length - 1;
  //var coords = data.features[lastFeature].geometry.coordinates;
  //console.log(coords);

  // Format the coordinates
  var newCoords = coords.join(';')
 // console.log(newCoords);


  // Set the radius for each coordinate pair to 25 meters
  var radius = [];
  coords.forEach(element => {
    radius.push(25);
  });
  getMatch(map, newCoords, radius, profile);
}
    
function getMatch(map, coordinates, radius, profile) {
  // Separate the radiuses with semicolons
  var radiuses = radius.join(';')
  // Create the query
  let query = 'https://api.mapbox.com/matching/v5/mapbox/' + profile + '/' + coordinates + '?geometries=geojson&radiuses=' + radiuses + '&steps=true&access_token=' + mapboxgl.accessToken;

  $.ajax({
    method: 'GET',
    url: query
  }).done(function(data) {
    // Get the coordinates from the response
    let coords = data.matchings[0].geometry;
    // Draw the route on the map
    addRoute(map, coords);
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

function addRoute(map, coords) {
  // If a route is already loaded, remove it
  if (map.getSource('route')) {
    map.removeLayer('route')
    map.removeSource('route')
  } else {
    map.addLayer({
      "id": "route",
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
        "line-color": "#03AA46",
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
          "title": "test",
          "icon": "monument"
        }
      }
      feats.push(item);
    }

    map.addLayer({
    "id": "points",
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


  };
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




