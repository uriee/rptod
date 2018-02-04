import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {selectAction, fetchSerialsIfNeeded, invalidateAction ,sendReport, login, setUser} from '../actions'
import Picker from '../components/Picker'
import Login from '../components/Login'
import Logout from '../components/Logout'
import Serials from '../components/Serials'

class App extends Component {
  static propTypes = {
    selectedAction: PropTypes.string.isRequired,
    serials: PropTypes.array.isRequired,
    actions: PropTypes.array.isRequired,    
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.number
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

  send = (obj,dispatch) => {
    console.log("OBJ:",obj)
    if(obj.quant > obj.limit) alert("The amount cannot be bigger than "+obj.limit/1000)
    else if(obj.quant < 1) alert("The amount must be bigger than 0")
    else this.props.dispatch(sendReport(obj,this.props.dispatch))
  }

  handleLogin = (obj) => {
    console.log("login:",obj)
    this.props.dispatch(login(obj,this.props.dispatch))
  }  

  handleLogout = () => {
    this.props.dispatch(setUser({user: -1, username: ''}))
  } 


  handleRefreshClick = e => {
    e.preventDefault()
    const { dispatch, selectedAction } = this.props
    dispatch(invalidateAction(selectedAction))
    dispatch(fetchSerialsIfNeeded(selectedAction))
  }

  render() {
    const { selectedAction, serials, isFetching, lastUpdated, actions, user, username, errmsg } = this.props
    const isEmpty = serials.length === 0
    console.log("aaaa",actions,)
    //[ 'None', 'FQC', 'SMT CS', 'WAVE SIDE 1', 'TU']
    return (
      <div>
      {(user === -1  ? <Login login={this.handleLogin} error={errmsg}/> : <Logout username={username} logout={this.handleLogout} />)}
      {(user === -1  ? <div/> : 
        <div>
        <Picker value={selectedAction}
                onChange={this.handleChange}
                options={ actions } />
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
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { selectedAction, serialsByAction, actionsByLogin, logIn, error } = state
  const {
    isFetching,
    lastUpdated,
    items: serials
  } = serialsByAction[selectedAction] || {
    isFetching: true,
    items: []
  }
  console.log("--------")
  const actions = actionsByLogin.actions || []
  const user =  parseInt(logIn.user,10) || -1
  const username = logIn.username
  const errmsg = error.error

  return {
    selectedAction,
    serials,
    isFetching,
    lastUpdated,
    actions,
    user,
    username,
    errmsg
  }
}

export default connect(mapStateToProps)(App)
