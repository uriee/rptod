import React from 'react'
import PropTypes from 'prop-types'

let Qinp = ({serial,send}) => {
  let input

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        var ret = {serial: serial.SERIAL, action: serial.ACT, quant: input.value}
        send(ret)
        input.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Send
        </button>
      </form>
    </div>
  )
}

Qinp.propTypes = {
  serial: PropTypes.object.isRequired,
  send: PropTypes.func.isRequired
}


export default Qinp

