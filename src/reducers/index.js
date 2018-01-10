import { combineReducers } from 'redux'
import {
  SELECT_ACTION, INVALIDATE_ACTION,
  REQUEST_SERIALS, RECEIVE_SERIALS, SENT_REPORT
} from '../actions'


const sentReport = (state ={}, action) => {
  switch (action.type) {
    case SENT_REPORT:
      console.log("sent:",state) 
      return state
    default:
      return state
  }
}

const selectedAction = (state = 'None', action) => {
  switch (action.type) {
    case SELECT_ACTION:
      return action.action
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
    default:
      return state
  }
}

const rootReducer = combineReducers({
  serialsByAction,
  selectedAction,
  sentReport
})

export default rootReducer
