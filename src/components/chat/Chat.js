import React, {Component} from 'react'

import './chat.css'

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textValue: "",
      messages: [
        {sender: 'server', time: 'now1', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now2', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now3', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now4', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now5', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now6', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now7', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now8', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now9', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now10', text: 'Welcome to Boomer Dog'},
        {sender: 'bene', time: 'later1', text: 'geh mal bier holn'},
        {sender: 'bene', time: 'later2', text: 'geh mal bier holn'},
        {sender: 'bene', time: 'later3', text: 'geh mal bier holn'}
      ],
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onEnterKey = this.onEnterKey.bind(this)
  }

  handleChange(event) {
    this.setState({textValue: event.target.value});  
  }

  handleSubmit(event) {
    this.setState({textValue: ''})
  }

  onEnterKey(event) {
    if (event.key === 'Enter' && event.shiftKey === false ) {
      this.handleSubmit()
    }
  }

  componentDidUpdate() {
    console.log("chat updated")
    var objDiv = document.getElementById("message-box");
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  render() {
    return (
      <div className='chatbox'>
        <div id='message-box' className='message-box'>
        {this.state.messages.map( msg => {
          // color server messages differently
          if (msg.sender === 'server') {
            return(
              <div className="message server-message" key={msg.time}>
                <div className="message-text">
                  <span className="mr-auto">{msg.text}
                  </span><span className="float-right">{msg.time}
                  </span>
                </div>
              </div>
            )
          } else {
            return(
              <div className="message" key={msg.time}>
                <div className="message-text">
                  <p className="message-text"><span><strong>{msg.sender}</strong></span><span className="float-right">{msg.time}</span></p>
                  <p className="message-text">{msg.text}</p>
                </div>
              </div>
            )
          }
        })}
        </div>
        <div className='editor-box'>
          <textarea 
            className="text-box"
            value={this.state.textValue}
            onChange={this.handleChange}
            onKeyUp={this.onEnterKey}
            rows="2" 
            placeholder="Type your message here...">
          </textarea>
          <input type="button" onClick={this.handleSubmit} value="Send" />
        </div>
      </div>
      )
  }
}
  
export default Chat;
  