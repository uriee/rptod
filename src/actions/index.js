export const REQUEST_SERIALS = 'REQUEST_SERIALS'
export const REQUEST_ACTIONS = 'REQUEST_ACTIONS'
export const RECEIVE_SERIALS = 'RECEIVE_SERIALS'
export const RECEIVE_ACTIONS = 'RECEIVE_ACTIONS'
export const SELECT_ACTION = 'SELECT_SERIAL'
export const INVALIDATE_ACTION = 'INVALIDATE_SERIAL'
export const SENT_REPORT = 'SENT_REPORT'
export const SEND_REPORT = 'SEND_REPORT'
export const LOGIN = 'LOGIN'
export const SETUSER = 'SETUSER'
export const ERROR = 'ERROR'
const server = 'http://192.9.200.17:4001'

export const login = (obj,dispatch) => ({
  type: 'LOGIN',
  obj: log(obj.username,obj.password)(dispatch)
})

export const setUser = (user) => ({
  type: 'SETUSER',
  user: user.user,
  username: user.username
})

const log = (username,password) => dispatch => {
  username = username||'None'
  password = password||'None'
  return fetch(`${server}/login/${username}/${password}`)
    .then(response => response.json())
    .then(json => {
      console.log("qqqqq----",json,json.length)
      if(!(json.length === 0) ){
        const user = (json[0] ?  json[0].USR : -1)
        const username = (json[0] ?  json[0].USERNAME : '')
        dispatch(fetchActions(user))
        dispatch(setUser({user: user, username: username}))
        dispatch(error(0,""))
      }
      else dispatch(error(1,"There is no such username / password"))
      return json;
      })  
}

export const error =   (errNum,errmsg) => ({
  type: ERROR,
  errNum: errNum,
  errmsg : errmsg
})


export const selectAction = action => ({
  type: SELECT_ACTION,
  action
})


export const invalidateAction = action => ({
  type: INVALIDATE_ACTION,
  action
})


export const requestSerials = action => ({
  type: REQUEST_SERIALS,
  action
})

export const requestActions = user => ({
  type: REQUEST_ACTIONS,
  user
})

export const receiveSerials = (action, json) => ({
  type: RECEIVE_SERIALS,
  action,
  serials: json.filter(serial => serial.QUANT > 0),
  receivedAt: Date.now()
})

export const receiveActions = (action, json) => ({
  type: RECEIVE_ACTIONS,
  action : action,
  actions: json.map(act => act),
})

const sendR = obj => dispatch => {
  console.log("SENDR",obj)
  return fetch(`${server}/insertprod/${obj.serial}/${obj.action}/${obj.quant}`)
    .then(response => response.json())
    .then(json => dispatch(sentReport(obj, json)))
    .then(json => dispatch(fetchSerials(obj.actname)))  
}

export const sendReport = (obj,dispatch) => ({
  type: 'SEND_REPORT',
  obj: sendR(obj)(dispatch)
})


const sentReport = (action, json) => ({
  type: SENT_REPORT,
  sent: action,
  answer: json,
})


const fetchSerials = action => dispatch => {
  dispatch(requestSerials(action))
  return fetch(`${server}/prod/${action}`)
    .then(response => response.json())
    .then(json => dispatch(receiveSerials(action, json)))
}


const fetchActions = user => dispatch => {
    dispatch(requestActions(user))
    return fetch(`${server}/useraction/${user}`)
    .then(response => response.json())
    .then(json => dispatch(receiveActions(user, json)))
}


const shouldFetchSerials = (state, action) => {
  const serials = state.serialsByAction[action]
  if (!serials) {
    return true
  }
  if (serials.isFetching) {
    return false
  }
  return serials.didInvalidate
}


export const fetchSerialsIfNeeded = action => (dispatch, getState) => {
  if (shouldFetchSerials(getState(), action)) {
    return dispatch(fetchSerials(action))
  }
}


