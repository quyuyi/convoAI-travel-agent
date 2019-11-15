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
                    <Button size="small" color="primary">
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
