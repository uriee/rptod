import React from 'react'
import PropTypes from 'prop-types'

let Login = ({login,error}) => {
let username,password
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        var ret = {username: username.value, password:  password.value}
        login(ret)
      }}>
        <h3>Sign in</h3>
        <input type="text" ref={ el => username = el } placeholder="enter you username" />
        <input type="password" ref={ el => password = el } placeholder="enter password" />
        <input type="submit" value="Login" />
      </form>
      <h2>{error}</h2> 
    </div> 
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  error: PropTypes.string,
}


export default Login

