import { UPDATE_DATA } from './actions.js';
import { UPDATE_ACTIVE_DATA } from './actions.js'
import { UPDATE_COUNTRIES } from './actions.js'
import { CHANGE_TOOLTIP } from './actions.js'

export default function updateState(state = initialState, action) {
  return {
    data : dataReducer(state.data, action),
    countries : countriesReducer(state.countries, action),
    activeData : activeDataReducer(state.activeData, action),
    tooltipShow : tooltipShowReducer(state.tooltipShow, action),
    tooltipContents : tooltipContentsReducer(state.tooltipContents, action)
  };
}



function generateReducer(defaultState, actionName) {
  return function(state = defaultState, action) {
    if(action.type !== actionName) { return state; }
    return action.data;
  }
}

var initialState = {
  data : [],
  countries : [],
  activeData : 'GDPPP_2015',
  tooltipShow : false,
  tooltipContents : null
};

var dataReducer = generateReducer(
  initialState.data, UPDATE_DATA);

var countriesReducer = generateReducer(
  initialState.countries, UPDATE_COUNTRIES);

var activeDataReducer = generateReducer(
  initialState.activeData, UPDATE_ACTIVE_DATA);


// Show Tooltip
function tooltipShowReducer(state = initialState.tooltipShow, action) {
  if(action.type !== CHANGE_TOOLTIP) { return state; }
  return action.show;
}

// Display Contents
function tooltipContentsReducer(state = initialState.tooltipContents, action) {
  if(action.type !== CHANGE_TOOLTIP) { return state; }
  if(action.contents) { return action.contents; }
  return null;
}


