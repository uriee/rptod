export const REQUEST_SERIALS = 'REQUEST_SERIALS'
export const RECEIVE_SERIALS = 'RECEIVE_SERIALS'
export const SELECT_ACTION = 'SELECT_SERIAL'
export const INVALIDATE_ACTION = 'INVALIDATE_SERIAL'
export const SENT_REPORT = 'SENT_REPORT'
export const SEND_REPORT = 'SEND_REPORT'



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


export const receiveSerials = (action, json) => ({
  type: RECEIVE_SERIALS,
  action,
  serials: json.map(serial => serial),
  receivedAt: Date.now()
})

const sendR = obj => dispatch => {
  console.log("SENDR",obj)
  return fetch(`http://192.9.200.17:4001/insertprod/${obj.serial}/${obj.action}/${obj.quant}`)
    .then(response => response.json())
    .then(json => dispatch(sentReport(obj, json)))  
}

export const sendReport = obj => dispatch => ({
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
  return fetch(`http://192.9.200.17:4001/prod/${action}`)
    .then(response => response.json())
    .then(json => dispatch(receiveSerials(action, json)))
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


