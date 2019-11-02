import React from 'react';
//import Select from 'react-select';

// https://www.w3schools.com/howto/howto_css_chat.asp
// https://bootsnipp.com/snippets/1ea0N

class Dialog extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            text:''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount (){
        var cont= document.getElementById("talkSub");
        
    }
    
    handleChange(e){
        this.setState({ text: e.target.value })
    }
    
    // add the user request or the clinc response to display in the chat box
    handleSubmit (e){
        e.preventDefault();
        var cont=document.getElementById("words");    
        let regu = "^[ ]+$";
        let re = new RegExp(regu);
        if (!re.test(this.state.text) & !(this.state.text==="")){
        cont.innerHTML += "<div class='btalk'><span id='bsay'>"+this.state.text+"</span></div>" +
                          "<div class='atalk'><span id='asay'>Hello</span></div>"
        this.setState({
            text: ""
        });
        };
        cont.scrollTop = cont.scrollHeight;
    }

    render (){
        return (
    <div class="talk_con">
        <div class="talk_show" id="words">
            <div class="atalk"><span id="asay">Hi, how can I help you?</span></div>
        </div>
        <div class="talk_input">
            <form onSubmit = {this.handleSubmit}>
                <input type="text" value={this.state.text} onChange={this.handleChange} class="talk_word" id="talkwords" placeholder="Type a message"/>
                <input type="submit" value="Send" class="talk_sub" id="talksub"/>
            </form>
        </div>
    </div>
        );
    }
}

export default Dialog;

