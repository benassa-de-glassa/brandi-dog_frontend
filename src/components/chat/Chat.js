import React, {Component} from 'react'

import './chat.css'

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textValue: "",
      messages: [
        {sender: 'server', time: 'now', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now', text: 'Welcome to Boomer Dog'},
        {sender: 'server', time: 'now', text: 'Welcome to Boomer Dog'},
        {sender: 'bene', time: 'later', text: 'geh mal bier holn'},
        {sender: 'bene', time: 'later', text: 'geh mal bier holn'},
        {sender: 'bene', time: 'later', text: 'geh mal bier holn'}
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
    console.log("message added")
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
  