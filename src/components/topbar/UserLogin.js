import React, { Component, Fragment } from 'react'

export default class UserLogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            errorMessage: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.submitError = this.submitError.bind(this)
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    async handleSubmit(event) {
        event.preventDefault();
        // supply callback in case of error
        this.props.login(
            this.state.username, 
            this.state.password, 
            this.submitError // error callback
        )
    }

    submitError(message) {
        this.setState({ value: '', placeholder: message })
    }

    render() {
        return (
            <Fragment>
            <form className='ml-auto mr-2' onSubmit={this.handleSubmit}>
                <label className='mr-1'>
                    Log in: </label>
                <div>
                    <input
                        name='username'
                        label='USERNAME'
                        type='text'
                        className='mr-1'
                        value={this.state.username}
                        onChange={this.handleChange}
                        placeholder='Username'
                    />
                    <input 
                        name='password'
                        label='PASSWORD'
                        type='password' 
                        className='mr-1' 
                        value={this.state.password} 
                        onChange={this.handleChange} 
                        placeholder='Password' 
                    />
                </div>
                <input type='submit' className='top-bar-link' value='Submit' />
            </form>
            </Fragment>
        )

    }
}