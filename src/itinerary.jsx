import React, { Fragment } from "react";
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


function updateRoute(map, coords, i) {
  // Set the profile
  var profile = "driving";
  // var profile = "driving-traffic";
  // var profile = "cycling";
  // Get the coordinates that were drawn on the map


  //var data = draw.getAll();
  //var lastFeature = data.features.length - 1;
  //var coords = data.features[lastFeature].geometry.coordinates;
  //console.log(coords);
  
  // format the record in our database
  let format_coords = [];
  coords.map((dest, idx) => {
    let coord;
    coord = [dest.coordinates.longitude, dest.coordinates.latitude];
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
  // let query = 'https://api.mapbox.com/matching/v5/mapbox/' + profile + '/' + coordinates + '?geometries=geojson&radiuses=' + radiuses + '&steps=true&access_token=' + mapboxgl.accessToken;
  let query = 'https://api.mapbox.com/directions/v5/mapbox/' + profile + '/' + coordinates + '?geometries=geojson&steps=true&access_token=' + mapboxgl.accessToken;


  $.ajax({
    method: 'GET',
    url: query
  }).done(function(data) {
    console.log(query);
    console.log(data);
    // Get the coordinates from the response
    // if ("matchings" in data && data.matchings.length > 0){
    //   let coords = data.matchings[0].geometry;
    //   // Draw the route on the map
    //   addRoute(map, coords, i);
    //   getInstructions(data.matchings[0]);
    // }
    // else {
    //   console.log(data);
    // }
    let coords = data.routes[0].geometry;
    addRoute(map, coords, data.waypoints, i,);
    getInstructions(data.routes[0]);

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





function addRoute(map, coords, waypoints, idx) {
  // If a route is already loaded, remove it
  // if (map.getSource('route')) {
  //   map.removeLayer('route')
  //   map.removeSource('route')
  // } else {
    const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFFFF", "#000000"];
    // const colors= ["#03AA46", "#FF0000"];
    map.addLayer({
      "id": "route"+idx.toString(),
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
    console.log(waypoints);
    for (let i = 0; i < coords.coordinates.length; ++i) {
      if (i==0 || i==coords.coordinates.length-1){
        let item = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": coords.coordinates[i].map(i => parseFloat(i))
          },
          "properties": {
            "title": i==0 ? waypoints[0].name : waypoints[1].name,
            "icon": "monument"
          }
        }
        feats.push(item);
      }
      else {
        let item = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": coords.coordinates[i].map(i => parseFloat(i))
          },
        }        
        feats.push(item);
      }
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

class Itinerary extends React.Component {

    constructor (props) {
      super(props);
    }

    buildMap = () => {
      mapboxgl.accessToken = 'pk.eyJ1IjoibHVib3VtaWNoIiwiYSI6ImNrMm5vdWRlODB2M3kzY205aTNwdTMxb2gifQ.Ax7uNaNJhLQVn00dJev4TA';
      var map = new mapboxgl.Map({
        container: 'map', // Specify the container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Specify which map style to use
        // center: ['-122.42060584672637', '37.80337168883928'], // Specify the starting position
        center: [this.props.schedule[0][0].coordinates.longitude, this.props.schedule[0][0].coordinates.latitude],
        zoom: 14.5, // Specify the starting zoom
      });

      // get coords list from this.props.schedule
      // this.props.schedule
      this.props.schedule.map((day, idx) => {
        console.log("update route for day ", idx);    
        if (day.length >=2) {
          updateRoute(map, day, idx);  
          console.log("finding route between places...")    
        }
        else {
          console.log("one place doesn't need route.")
        }
      });
    }

    componentDidUpdate(prevProps) {
      if (this.props.show && this.props.destinations.length != prevProps.destinations.length) {
        this.handleGenerate();
      } else if (this.props.show && JSON.stringify(this.props.destinations) != JSON.stringify(prevProps.destinations)) {
        this.handleGenerate(); // meh, just cleaner not combining long conditions
      } 
      else if (this.props.show !== prevProps.show) {
        if (this.props.schedule.length > 0) {
          this.buildMap();
        }
      }
    }

    handleGenerate(){
      //this.props.updateDest();
      
      if (this.props.schedule.length > 0) {
        let divideByDay = Math.ceil(this.props.destinations.length / this.props.trip_length);
        let count = 0;
        let dayDest = [];

        let coordsByDestination = [];
        for (let i = 0; i < this.props.destinations.length; ++i) {
          for (let j = 0; j < this.props.schedule.length; ++j) {
            for (let h = 0; h < this.props.schedule[j].length; ++h) {
              if (this.props.schedule[j][h].name == this.props.destinations[i]) {
                dayDest.push(this.props.schedule[j][h]);
                count++;
                if (count === divideByDay) {
                  count = 0;
                  coordsByDestination.push(dayDest);
                  dayDest = [];
                }
                break;
              }
            }
          }
        }

        if (dayDest.length > 0) {
          coordsByDestination.push(dayDest);
        }
  
        console.log("coords by destination", coordsByDestination);

        mapboxgl.accessToken = 'pk.eyJ1IjoibHVib3VtaWNoIiwiYSI6ImNrMm5vdWRlODB2M3kzY205aTNwdTMxb2gifQ.Ax7uNaNJhLQVn00dJev4TA';
        var map = new mapboxgl.Map({
          container: 'map', // Specify the container ID
          style: 'mapbox://styles/mapbox/streets-v11', // Specify which map style to use
          // center: ['-122.42060584672637', '37.80337168883928'], // Specify the starting position
          center: [coordsByDestination[0][0].coordinates.longitude, coordsByDestination[0][0].coordinates.latitude],
          zoom: 14.5, // Specify the starting zoom
        });

        // get coords list from this.props.schedule
        // this.props.schedule

        coordsByDestination.map((day, idx) => {
          console.log("update route for day ", idx);    
          if (day.length >=2) {
            updateRoute(map, day, idx);  
            console.log("finding route between places...")    
          }
          else {
            console.log("one place doesn't need route.")
          }
        });
      }
    }

    render(){
      return(
        <Fragment></Fragment>
      );
    }

}

export { Itinerary, updateRoute };




