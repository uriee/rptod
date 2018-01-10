import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {selectAction, fetchSerialsIfNeeded, invalidateAction ,sendReport} from '../actions'
import Picker from '../components/Picker'
import Serials from '../components/Serials'

class App extends Component {
  static propTypes = {
    selectedAction: PropTypes.string.isRequired,
    serials: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch, selectedAction } = this.props
    dispatch(fetchSerialsIfNeeded(selectedAction))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedAction !== this.props.selectedAction) {
      const { dispatch, selectedAction } = nextProps
      dispatch(fetchSerialsIfNeeded(selectedAction))
    }
  }

  handleChange = nextAction => {
    this.props.dispatch(selectAction(nextAction))
  }

  send = obj => {
    console.log("OBJ:",obj)
    this.props.dispatch(sendReport(obj))
  }

  handleRefreshClick = e => {
    e.preventDefault()
    const { dispatch, selectedAction } = this.props
    dispatch(invalidateAction(selectedAction))
    dispatch(fetchSerialsIfNeeded(selectedAction))
  }

  render() {
    const { selectedAction, serials, isFetching, lastUpdated } = this.props
    const isEmpty = serials.length === 0
    return (
      <div>
        <Picker value={selectedAction}
                onChange={this.handleChange}
                options={[ 'None', 'FQC', 'SMT CS', 'WAVE SIDE 1', 'TU']} />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <button onClick={this.handleRefreshClick}>
              Refresh
            </button>
          }
        </p>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Serials serials={serials} send={this.send}/>
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { selectedAction, serialsByAction } = state
  const {
    isFetching,
    lastUpdated,
    items: serials
  } = serialsByAction[selectedAction] || {
    isFetching: true,
    items: []
  }

  return {
    selectedAction,
    serials,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App)
