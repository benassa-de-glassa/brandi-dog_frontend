import React, {Component} from 'react'

import './chat.css'
import { socket } from '../../socket'

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textValue: "",
      messages: [
        {sender: 'server', time: 'now10', text: 'Welcome to Boomer Dog'},
        {sender: 'bene', time: 'later3', text: 'geh mal bier holn'}
      ],
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onEnterKey = this.onEnterKey.bind(this)
    this.addMessage = this.addMessage.bind(this)
  }

  handleChange(event) {
    this.setState({textValue: event.target.value});  
  }

  handleClick() {
    socket.emit('chat_message', {
      sender: this.props.player.name,
      text: this.state.textValue
    })
    this.setState({textValue: ''})
  }

  onEnterKey(event) {
    if (event.key === 'Enter' && event.shiftKey === false ) {
      this.handleClick()
    }
  }

  componentDidUpdate() {
    console.log("chat updated")
    var objDiv = document.getElementById("message-box");
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  componentDidMount() {
    console.log('chat moutned')
    socket.on('chat_message', data => {
      console.log('received')
      this.addMessage(data)
    })
  }

  addMessage(data) {
    this.setState( prevState => ({
      messages: [...prevState.messages, data]
    }))
    console.log(this.state.messages)
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
          <form>
            <textarea 
              className="text-box"
              value={this.state.textValue}
              onChange={this.handleChange}
              onKeyUp={this.onEnterKey}
              rows="2" 
              placeholder="Type your message here...">
            </textarea>
            <input type="submit" onClick={this.handleClick} value="Send" />
          </form>
        </div>
      </div>
      )
  }
}
  
export default Chat;
  