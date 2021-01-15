import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { raceListReducer, singleRaceInfoReducer, startInfoReducer } from './reducers/simulatorReducers'

const reducer = combineReducers({
    raceList: raceListReducer,
    singleRaceInfo: singleRaceInfoReducer,
    startInfo: startInfoReducer,
})

const initialState = {}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store