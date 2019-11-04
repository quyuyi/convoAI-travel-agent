import React from 'react';
import Chip from '@material-ui/core/Chip';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import GroupIcon from '@material-ui/icons/Group';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import DateRangeIcon from '@material-ui/icons/DateRange';

class UserInfo extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            city: 'Ann Arbor',
            duration: '4 days',
            visitor: 'with firends',
        };

    }

    componentDidMount () {
    }

    render(){
        const city = this.state.city;
        const duration = this.state.duration;
        const visitor = this.state.visitor;
        return (
            <div> 
            <Chip id = "city" color="primary" icon = {<LocationCityIcon />} label = {city} />
            <Chip id = "duration" color="secondary" icon = {<DateRangeIcon />} label = {duration} />
            <Chip id = "visitor" color="default" icon = {<GroupIcon />} label = {visitor} />
            </div>
        );
    }
}

export default UserInfo;