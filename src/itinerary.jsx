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


const sample_props = [
  [
    {'name': 'place1',
    'coordinates': {'longitude': '-122.42060084672637', 'latitude': '37.80337168883928'}},
    {'name': 'place2',
    'coordinates': {'longitude': '-122.41051199129258', 'latitude': '37.79931950915626'}},
    {'name': 'place3',
    'coordinates': {'longitude': '-122.41851199129268', 'latitude': '37.79931950915616'}}
  ],
  [
    {'name': 'place4',
    'coordinates': {'longitude': '-122.42060584673637', 'latitude': '37.80337168873928'}},
    {'name': 'place5',
    'coordinates': {'longitude': '-122.41851199121258', 'latitude': '37.79931950905626'}},
  ],
];

class Itinerary extends React.Component {

    constructor (props) {
      super(props);
      console.log(this.props);
      console.log(this.props.schedule.length);
      if (this.props.schedule.length > 0) {
        const center_coords = [this.props.schedule[0][0].coordinates.longitude, this.props.schedule[0][0].coordinates.latitude];  
        this.state = {
          center_coords: center_coords,
          schedule: this.props.schedule,
        };      
      }
      else {
        this.state = {
          center_coords: ['-122.42060584672637', '37.80337168883928'],
          schedule: sample_props,
        }
      }      
      console.log("print state for itinerary...")
      console.log(this.state.schedule);
      console.log(this.state.center_coords);
    }


    componentDidMount (){
      // Add your Mapbox access token
      mapboxgl.accessToken = 'pk.eyJ1IjoibHVib3VtaWNoIiwiYSI6ImNrMm5vdWRlODB2M3kzY205aTNwdTMxb2gifQ.Ax7uNaNJhLQVn00dJev4TA';
      var map = new mapboxgl.Map({
        container: 'map', // Specify the container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Specify which map style to use
        // center: ['-122.42060584672637', '37.80337168883928'], // Specify the starting position
        center: this.state.center_coords,
        zoom: 14.5, // Specify the starting zoom
      });

      // get coords list from this.props.schedule
      // this.props.schedule
      this.state.schedule.map((day, idx) => {
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



    handleGenerate(){
      console.log("handle regenerate need implementation...");
    }


  


    render(){
      let d = [];
      this.state.schedule.map((day, idx)=> {
        day.map((dest, idx2) => {
          let record = {
            'day': idx+1,
            'destination': dest.name,
            // 'description': 'https://caennews.engin.umich.edu/wp-content/uploads/sites/304/2017/05/ggbl2505-article-300x231.jpg'
          };
          d.push(record);
        })
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
    let coord = [dest.coordinates.longitude, dest.coordinates.latitude];
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


export default Itinerary;




