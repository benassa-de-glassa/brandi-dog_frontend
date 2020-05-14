import React, { Component } from 'react'

class UserRegistration extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            placeholder: 'Enter user name'
        }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.submitError = this.submitError.bind(this)
    }

    handleChange(event) {
        this.setState({value: event.target.value})
    }

    async handleSubmit(event) {
        event.preventDefault();
        // supply callback in case of error
        this.props.registerPlayer(this.state.value, this.submitError)
    }

    submitError(message) {
        this.setState({value: '', placeholder: message})
    }

    render() {
        return (
            <form className='ml-auto mr-2' onSubmit={this.handleSubmit}>
                <label className='mr-1'>
                Log in: </label>
                <input type='text' className='mr-1' value={this.state.value} onChange=
            {this.handleChange} placeholder={this.state.placeholder}/>
                
                <input type='submit' className='top-bar-link' value='Submit' />
            </form>
        )

    }
}

export default UserRegistration