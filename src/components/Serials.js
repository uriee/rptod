import React from 'react'
import PropTypes from 'prop-types'
import Qinp from './Qinp.js'

const Serials = ({serials,send}) => (
  <ul>
    {serials.map((serial, i) =>
      <li key={i}>{serial.SERIALNAME} -  {serial.PARTNAME} - {serial.QUANT/1000} - <Qinp serial={serial} send={send} />
      </li>
    )}
  </ul>
)

Serials.propTypes = {
  serials: PropTypes.array.isRequired,
  send: PropTypes.func.isRequired  
}

export default Serials
