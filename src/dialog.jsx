import React from 'react';
import AdbIcon from '@material-ui/icons/Adb';
import PersonIcon from '@material-ui/icons/Person';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

// https://www.w3schools.com/howto/howto_css_chat.asp
// https://bootsnipp.com/snippets/1ea0N

class Dialog extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            history: [
                {"from": "clinc", "msg": "Hi, how can I help you?"}
            ],
            text: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount (){
        var cont= document.getElementById("talkSub");
        
    }
    
    // add the user request or the clinc response to display in the chat box
    handleSubmit (e){
        var cont=document.getElementById("words");    
        let regu = "^[ ]+$";
        let re = new RegExp(regu);
        const text=document.getElementById("userInput").value;
        if (!re.test(text) & !(text==="")){
            const previous = this.state.history;
            const record_user = {
                "from": "user",
                "msg": text,
            }

            // TODO
            // send user utterence to clinc
            // get response from clinc
            const record_clinc = {
                "from": "clinc",
                "msg": "response from clinc",
            }
            this.setState({
                history: [...previous, record_user, record_clinc],
                text: ""
            });
            document.getElementById("userInput").value='';
        };
        cont.scrollTop = cont.scrollHeight;
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
                    inputProps={{ 'aria-label': 'request clinc' }}
                />
                <IconButton 
                aria-label="send"
                className="iconButton"
                onClick={()=>this.handleSubmit()}>
                    <SendIcon />
                </IconButton>
                <Divider orientation="vertical" className="divider"/>
                <IconButton className="iconButton" color="primary" aria-label="voice">
                    <MicIcon />
                </IconButton>
                </span>
                </Paper>
            </div>
        );
    }

    render (){
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


    // renderIncomingMsg (msg){
    //     return();
    // }
}

export default Dialog;


// <div class="mesgs">
//           <div class="msg_history">
//             <div class="incoming_msg">
//               <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
//               <div class="received_msg">
//                 <div class="received_withd_msg">
//                   <p>Test which is a new approach to have all
//                     solutions</p>
//                   <span class="time_date"> 11:01 AM    |    June 9</span></div>
//               </div>
//             </div>
//             <div class="outgoing_msg">
//               <div class="sent_msg">
//                 <p>Test which is a new approach to have all
//                   solutions</p>
//                 <span class="time_date"> 11:01 AM    |    June 9</span> </div>
//             </div>
//             <div class="incoming_msg">
//               <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
//               <div class="received_msg">
//                 <div class="received_withd_msg">
//                   <p>Test, which is a new approach to have</p>
//                   <span class="time_date"> 11:01 AM    |    Yesterday</span></div>
//               </div>
//             </div>
//             <div class="outgoing_msg">
//               <div class="sent_msg">
//                 <p>Apollo University, Delhi, India Test</p>
//                 <span class="time_date"> 11:01 AM    |    Today</span> </div>
//             </div>
//             <div class="incoming_msg">
//               <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
//               <div class="received_msg">
//                 <div class="received_withd_msg">
//                   <p>We work directly with our designers and suppliers,
//                     and sell direct to you, which means quality, exclusive
//                     products, at a price anyone can afford.</p>
//                   <span class="time_date"> 11:01 AM    |    Today</span></div>
//               </div>
//             </div>
//           </div>
//           <div class="type_msg">
//             <div class="input_msg_write">
//               <input type="text" class="write_msg" placeholder="Type a message" />
//               <button class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
//             </div>
//           </div>
//         </div>
//       </div>
      