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
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
    
    handleClick(){
        console.log("call backend to record...");
        this.postData('/record_to_text/', {query: "record"}) 
        .then(data => {
            console.log("get reponse: ", data.response);
            this.handleSubmit(data.response);
        }) // JSON-string from `response.json()` call
       .catch(error => console.error(error));
    }
   
    handleSubmit (text){
        var cont=document.getElementById("words");
        let regu = "^[ ]+$";
        let re = new RegExp(regu);
        if (!re.test(text) & !(text==="")){
            const previous = this.state.history;
            const record_user = {
                "from": "user",
                "msg": text,
            }
            this.setState({
                first: false,
                loading: true,
                history: [...previous, record_user],
            });
            cont.scrollTop = cont.scrollHeight;
            document.getElementById("userInput").value='';
            this.queryClinc(text);
        };
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
                    <Button type ="button" onClick={()=>this.handleClick} size="small" color="primary">
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
