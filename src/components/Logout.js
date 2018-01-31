import React from 'react'
import PropTypes from 'prop-types'

let Logout = ({username,logout}) => {
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        logout()
      }}>
        <h1>{username} </h1> <input type="submit" value="Logout" />
      </form>
    </div> 
  )
}

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
  username : PropTypes.string.isRequired
}


export default Logout

