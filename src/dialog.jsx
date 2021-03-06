import React from 'react';
import AdbIcon from '@material-ui/icons/Adb';
import PersonIcon from '@material-ui/icons/Person';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import BeatLoader from 'react-spinners/BeatLoader';
import { css } from '@emotion/core';
import ReactAudioPlayer from 'react-audio-player';

// https://www.w3schools.com/howto/howto_css_chat.asp
// https://bootsnipp.com/snippets/1ea0N
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
class Dialog extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            first: true,
            loading: false,
            history: [
                {"from": "clinc", "msg": "Hi! I'm your virtual travel assistant. Please tell me your destination city, length of visit, and number of people so I can plan the travel for you.",}
            ],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onRecord = this.onRecord.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.loadingTrue = this.loadingTrue.bind(this);
        this.updateHistory = this.updateHistory.bind(this);
    }

    updateHistory (record) {
        const previous = this.state.history;
        this.setState({
            loading: false,
            history: [...previous, record],
        });
    }

    loadingTrue(){
        this.setState({
            loading: true,
        });
    }

    componentDidMount (){
        var cont= document.getElementById("talkSub");
    }

    onKeyDown (event){
        if (event.key === 'Enter') {
            // event.preventDefault();
            // event.stopPropagation();
            this.onSubmit();
          }
    }

    onRecord (){
        console.log("call backend to record...");
        this.props.post('/record_to_text/', {query: "record"}) 
        .then(data => {
            // console.log("get reponse: ", data.response);
            this.handleSubmit(data.response);
        }) // JSON-string from `response.json()` call
        .catch(error => console.error(error));
    }
    
    onSubmit (e){
        const text=document.getElementById("userInput").value;
        this.handleSubmit(text);
    }

    // add the user request or the clinc response to display in the chat box
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
            this.props.queryClinc(text);
        };
    }


    // // send user utterence to backend which post to clinc
    // // get response from clinc
    // queryClinc(query) {
    //     var cont=document.getElementById("words");
    //     console.log("request backend server..")
    //     console.log(query)
    //     this.props.post('/query_clinc/', {query: query, userId: this.props.userId}) 
    //     .then(data => {
    //         // console.log("get reponse: ", data.response);
    //         const previous = this.state.history;
    //         const record_clinc = {
    //             "from": "clinc",
    //             "msg": data.response,
    //         };

    //         // update userInfo chips
    //         var city = '';
    //         var visitor = '';
    //         var length = '';
    //         if (data.addCity) city = data.city
    //         if (data.addVisitor) visitor = data.visitor
    //         if (data.addLength) length = data.length
    //         // console.log("add city is: ", city);
    //         // console.log("add visitor is: ", data.visitor);
    //         // console.log("add length is: ", length);
    //         this.props.handleUserInfo(city, visitor, length);

    //         // update destInfo window
    //         console.log(data);
    //         if (data.response == "Your itinerary has been generated!") {
    //             this.props.destinationRequests("Generate itinerary");
    //         }

    //         if (data.isRecommendation) {
    //             let dest = document.getElementById("destination-img");
    //             dest.setAttribute("src", data.img);
    //             console.log("img element information...");
    //             document.getElementById("destination-name").innerHTML = data.dest;
    //             document.getElementById("destination-intro").innerHTML = data.intro;
    //         }
    //         // update distination list
    //         this.props.handleUpdate('destinations',data.destinations);

    //         // update schedule list
    //         if (data.schedule != []){
    //             this.props.handleUpdate('schedule', data.schedule);
    //         }

    //         // update chat histoty
    //         this.setState({
    //             loading: false,
    //             history: [...previous, record_clinc],
    //         });
    //         window.audio = new Audio();
    //         window.audio.src = "/get_audio";
    //         window.audio.play();
    //         cont.scrollTop = cont.scrollHeight;
    //     }) // JSON-string from `response.json()` call
    //     .catch(error => console.error(error));
    // }

    renderLoader (){
        return (
            <div className="atalk">
            <AdbIcon /> 
            <span id="asay">
                <div className='sweet-loading'>
                <BeatLoader
                css={override}
                sizeUnit={"px"}
                size={15}
                color={'white'}
                loading={this.state.loading}
                />
                </div>
            </span>
            </div>
        );
    }

    renderNothing (){
        return (
            <div></div>
        );
    }


    renderMsg (record){
        if (record['from'] == "clinc"){
            return (
                <div className="atalk"><AdbIcon /> <span id="asay">{record['msg']}</span></div>
            );
        }
        else{
            return(
                <div className="btalk"><span id="bsay">{record['msg']}</span><PersonIcon /></div>
            );
        }
    }

    renderInput (){
        return(
            <div>
                <Paper className="talk_input" id="talkwords">
                <span>
                <InputBase
                    id="userInput"
                    className="talk_word"
                    placeholder="Type a message"
                    onKeyDown={e=>this.onKeyDown(e)}
                    inputProps={{ 'aria-label': 'request clinc' }}
                />
                <IconButton 
                aria-label="send"
                className="iconButton"
                onClick={()=>this.onSubmit()}>
                    <SendIcon />
                </IconButton>
                {/* <Divider orientation="vertical" className="divider"/> */}
                <IconButton 
                className="iconButton" 
                onClick={()=>this.onRecord()}
                color="primary" 
                aria-label="voice">
                    <MicIcon />
                </IconButton>
                </span>
                </Paper>
            </div>
        );
    }

    render () {
        return (
        <div className="talk_con">
            <div className="talk_show" id="words">
                {this.state.history.map((record,index)=>{
                    return (
                        <div key={index}>
                            {this.renderMsg(record)}
                        </div>
                    );
                })}
                {this.state.loading ? this.renderLoader() : this.renderNothing()}

        </div>
        {/* <div className="talk_input">
            <form onSubmit = {this.handleSubmit}>
                <input type="text" value={this.state.text} onChange={this.handleChange} className="talk_word" id="talkwords" placeholder="Type a message"/>
                <input type="submit" value="Send" className="talk_sub" id="talksub"/>
            </form>
        </div> */}
        {this.renderInput()}
         </div>
        );
    }
}

export default Dialog;
