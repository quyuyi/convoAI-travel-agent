import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class DestInfo extends React.Component {

    constructor (props) {
        super(props);
        this.state = {"destination": ""}
        this.handleAdd = this.handleAdd.bind(this);
    }
    
    postData(url = '', data = {}) {
        // Default options are marked with *
            return fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrer: 'no-referrer', // no-referrer, *client
                body: JSON.stringify(data), // body data type must match "Content-Type" header
            })
            .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    componentDidMount() {
        // Call REST API to get number of likes
        this.setState({"destination": document.getElementById("dest").innerHTML, user_id: this.props.userId});
    }
    
    // TODO
    handleAdd(){
        console.log("click on button");
        let data = {destination: document.getElementById("dest").innerHTML, user_id: this.props.userId}
        console.log(data)
        this.postData('/add_destination/', data) 
        .then(dat => {
            // console.log("get reponse: ", data.response);
            console.log("data", dat);
            this.props.handleUpdate('destinations',dat.destinations);
        }) // JSON-string from `response.json()` call
        .catch(error => console.error(error));
    }


    
    
    render (){
        const cardStyle = {
              maxWidth: 600,
              maxHeight: 600,
        };

        const contentHeaderStyle = {
            height: 50,
        }

        const contentStyle = {
            maxHeight: 150,
            overflow: "auto",
        }

        const mediaStyle = {
            // height: 140,
              height: 300,
        };

        return (
            <div>
                <Card style = {cardStyle}>
                <CardActionArea>
                    {/* <CardMedia
                    id = "dest_img"
                    style = {mediaStyle}
                    image = "static/img/NCRB.jpg"
                    title = "Contemplative Reptile"
                    /> */}
                    <img 
                    id = "dest_img"
                    style = {mediaStyle}
                    src="/static/img/NCRB.jpg"></img>
                    <CardContent style = {contentHeaderStyle}>
                    <Typography id = "dest" gutterBottom variant="h5" component="h2">
                        Hi
                    </Typography>
                    </CardContent>
                    <CardContent
                    style = {contentStyle}>
                    <Typography id = "intro" variant="body2" color="textSecondary" component="p">
                    Welcome to EECS498 Conversational AI.
                    </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {/* <button type="button" onClick={()=>this.handleAdd()}> add </button> */}
                    <Button type ="button" onClick={()=>this.handleAdd()} size="small" color="primary">
                    Add
                    </Button>
                    <Button size="small" color="primary">
                    Learn More
                    </Button>
                </CardActions>
                </Card>
            </div>
        );
    }
}

export default DestInfo;
