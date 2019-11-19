import React from 'react';
import Chip from '@material-ui/core/Chip';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import GroupIcon from '@material-ui/icons/Group';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import DateRangeIcon from '@material-ui/icons/DateRange';

class UserInfo extends React.Component {
    constructor (props) {
        super(props);
        // console.log("print from UserInfo constructure");
        // console.log(this.props);
    }

    componentDidMount() {
        
    }

    render(){
        const city = this.props.city;
        // console.log("print from userInfo.jsx");
        // console.log(city);
        const duration = this.props.length;
        const visitor = this.props.visitor;
        return (
            <div className="user-info"> 
                { city ? <Chip id = "city" color="primary" icon = {<LocationCityIcon />} label = {this.props.city} /> : '' }
                { duration ? <Chip id = "duration" color="secondary" icon = {<DateRangeIcon />} label = {duration + " days"} /> : '' }
                { visitor ? <Chip id = "visitor" color="default" icon = {<GroupIcon />} label = {visitor + " people"} /> : '' }
            </div>
        );
    }
}

export default UserInfo;