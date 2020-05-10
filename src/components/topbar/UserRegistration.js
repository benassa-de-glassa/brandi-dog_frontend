import React, { Component } from 'react'

import { API_URL, postData } from '../../paths'

class UserRegistration extends Component {
    constructor(props) {
        super(props)
        this.state = {value: ''}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({value: event.target.value})
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.props.registerPlayer(this.state.value)
    }

    render() {
        return (
            <form className='ml-auto mr-2' onSubmit={this.handleSubmit}>
                <label className='mr-1'>
                Log in: </label>
                <input type='text' className='mr-1' value={this.state.value} onChange=
            {this.handleChange} placeholder='Enter user name'/>
                
                <input type='submit' className='top-bar-link' value='Submit' />
            </form>
        )

    }
}

export default UserRegistration