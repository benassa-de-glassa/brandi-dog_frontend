import React, { useState, Fragment } from 'react'

function UserCreate(props) {
    const [state, setState] = useState(
        {
            username: '',
            password: '',
            errorMessage: ''
        }
    )
    const handleChange = event => {
        setState({ [event.target.name]: event.target.value })
    }

    const handleSubmit = async event => {
        event.preventDefault();
        // supply callback in case of error
        props.createUser(
            state.username,
            state.password,
            submitError // error callback
        )
    }

    const submitError = message => {
        setState({ value: '', errorMessage: message })
    }


    return (
        <Fragment>
            <form className='ml-auto mr-2' onSubmit={handleSubmit}>
                <label className='mr-1'>
                    Create user account: </label>
                <input
                    name='new-username'
                    // label='USERNAME'
                    type='text'
                    className='mr-1'
                    value={state.username}
                    onChange={handleChange}
                    placeholder='Username'
                />
                <input
                    name='new-password'
                    // label='PASSWORD'
                    type='password'
                    className='mr-1'
                    value={state.password}
                    onChange={handleChange}
                    placeholder='Password'
                />
                <input type='submit' className='top-bar-link' value='Create user' />
            </form>
        </Fragment>
    )

}


export default UserCreate