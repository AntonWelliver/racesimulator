import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { raceListReducer, singleRaceInfoReducer, startInfoReducer, resultInfoReducer } from './reducers/simulatorReducers'

const reducer = combineReducers({
    raceList: raceListReducer,
    singleRaceInfo: singleRaceInfoReducer,
    startInfo: startInfoReducer,
    resultInfo: resultInfoReducer
})

const startlistFromStorage = sessionStorage.getItem('startlist') ? JSON.parse(sessionStorage.getItem('startlist')) : {}

const initialState = {
    startInfo: { startList: startlistFromStorage }
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store