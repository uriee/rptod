import { combineReducers } from 'redux'
import {
  SELECT_ACTION, INVALIDATE_ACTION,
  REQUEST_SERIALS, RECEIVE_SERIALS, SENT_REPORT,
  REQUEST_ACTIONS, RECEIVE_ACTIONS, SETUSER, ERROR
} from '../actions'


const error = (state ={ errnum:0, error:"" }, action) => {
  switch (action.type) {
    case ERROR:
      return({
        errNum : action.errNum,
        error : action.errmsg 
      })  
    default:
      return state
  }
}

const logIn = (state ={}, action) => {
  switch (action.type) {
    case SETUSER:
      return {...state,
              user: action.user,
              username: action.username
              }
    default:
      return state
  }
}


const sentReport = (state ={}, action) => {
  switch (action.type) {
    case SENT_REPORT:
      return state
    default:
      return state
  }
}

const selectedAction = (state = '-', action) => {
  switch (action.type) {
    case SELECT_ACTION:
      return action.action
    case SETUSER:
      if (action.user === -1) return '-'; else return state  
    default:
      return state
  }
}

const serials = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case INVALIDATE_ACTION:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_SERIALS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_SERIALS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.serials,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}


const serialsByAction = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_ACTION:
    case RECEIVE_SERIALS:
    case REQUEST_SERIALS:
      return {
        ...state,
        [action.action]: serials(state[action.action], action)
      }
    case SETUSER:
      if (action.user === -1) return {}; else return state  
    default:
      return state
  }
}

const actionsByLogin = (state = { }, action) => {
  switch (action.type) {
    case RECEIVE_ACTIONS:
      return {
        ...state,
        actions : action.actions.map((act) => act.ACTNAME)
      }    
    case REQUEST_ACTIONS:
      return {
        ...state
      }
    case SETUSER:
      if (action.user === -1) return {}; else return state   
    default:
      return state
  }
}

const rootReducer = combineReducers({
  serialsByAction,
  actionsByLogin,
  selectedAction,
  sentReport,
  logIn,
  error,
})

export default rootReducer
