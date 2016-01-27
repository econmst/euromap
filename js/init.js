'use strict';

import d3 from 'd3';
import topojson from 'topojson';

import ToggleBarRaw from './toggle-bar.js';


import React from 'react';
import countries from './countries.js';

import colours from './econ_colours.js';

import { Im, parseNumerics, connectMap }
  from './utilities.js';

import TooltipRaw from './tooltip.js';

import SliderRaw from './slider.js';

import Header from './header.js';

import ChartContainer from './chart-container.js';
import GradientScaleRaw from './gradient-scale.js';

import chroma from 'chroma-js';

import { createStore, compose } from 'redux';
import { connect, Provider } from 'react-redux';

import { updateData, updateCountries, updateActiveData, showTooltip, hideTooltip } from './actions.js';

import updateState from './reducers.js';

// Load in d3 Map layers
import D3MapRaw from './d3map.js';

// const CREATESTORE = createStore;

const DEBUGCREATESTORE = compose(
    window.devToolsExtension() || (f => f)
  )(createStore);
  var store = DEBUGCREATESTORE(updateState);
  window.store = store;


// Create Store
var store = createStore(updateState);
window.store = store;


// Header Section  - activeData is csv file
var TiedHeader = connect(function(state) {
  if (!datasets[state.activeData]) {
    console.log("error", state.activeData);
  }
    return {
      title : "EuroMap",
    subtitle : datasets[state.activeData].subtitle
    };
})(Header);

// colour scales
// var scaleFill = [colours.blue[1], colours.red[3], colours.red[0]];
var scaleFill = [colours.blue[1], colours.red[3], colours.red[0]];

// const DATA_SERIES = ["GDPPP_2015", "Unemployment_2015", "Primary_Balance_2015", "GDPLatest_2015", "GDP_2016", "GDP_2017"];

var datasets = {
  GDPPP_2015 : {
    scale : chroma.scale(scaleFill).mode('lab').domain([0, 100]),
    formatter : d3.format(',.0f'),
    mod: 'log',
    modDomain : [1, 100],
    unit : (<span>GDPPP_2015<sub>2</sub> in 2015</span>),
    subtitle : 'GDPPP_2015'
  },
  Unemployment_2015 : {
    scale : chroma.scale(scaleFill).mode('lab').domain([1, 25]),
      formatter : d3.format(',.0f'),
      mod: 'log',
      modDomain : [1, 25],
      unit : (<span>Unemployment_2015<sub>2</sub> in 2015</span>),
      subtitle : 'Unemployment_2015'
  }, 
  Primary_Balance_2015 : {
    scale : chroma.scale(scaleFill).mode('lab').domain([0, 5]),
      formatter : d3.format(',.0f'),
      mod: 'log',
      modDomain : [0, 5],
      unit : (<span>Unemployment_2015<sub>2</sub> in 2015</span>),
      subtitle : 'Primary_Balance_2015'
  },
  GDPLatest_2015 : {
    scale : chroma.scale(scaleFill).mode('lab').domain([-5, 20]),
     formatter : d3.format(',.0f'),
      mod: 'log',
      modDomain : [-5, 5],
      unit : (<span>Unemployment_2015<sub>2</sub> in 2015</span>),
      subtitle : 'GDPLatest_2015'
  },
  GDP_2016 : {
    scale : chroma.scale(scaleFill).mode('lab').domain([-5, 5]),
     formatter : d3.format(',.0f'),
       mod: 'log',
      modDomain : [-5, 5],
    unit : (<span>Unemployment_2015<sub>2</sub> in 2015</span>),
      subtitle : 'GDP_2016'
  }, 
  GDP_2017 : {
    scale : chroma.scale(scaleFill).mode('lab').domain([-5, 5]),
     formatter : d3.format(',.0f'),
      mod: 'log',
      modDomain : [-5, 5],
      unit : (<span>Unemployment_2015<sub>2</sub> in 2015</span>),
      subtitle : 'GDP_2017'
  }
};

// create d3 map, use connect function
  var D3Map = connect(function (state) {
        var hasData = !!state.data.length;
        var metadata = datasets[state.activeData];

    return {
        layers: [
                  { data : state.countries, name : 'countries' },
          ], 
        layerAttrs: {
          countries : {
              fill : (d) => {

                      console.log(state.activeData);

                      var iso2 = d.properties.ISO2;
                      var data = state.data.filter(r => r.ISO2 === iso2);
                      data = data.length ? data[0] : null;
                      if(hasData && data) {
                        return metadata.scale(data[state.activeData]);
                      }
                      // no data
                      return colours.grey[9];
                    }
                  }
                }
              };
            })(D3MapRaw);


// The dispatch() function can be accessed directly from the store as store.dispatch(), 
// but more likely you'll access it using a helper like react-redux's connect(). 
// You can use bindActionCreators() to automatically bind many action creators to a dispatch() function.

        // { title : 'Dept', key : 'dept', value : 'dept'},
        // { title : 'ss', key : 'growth', value : 'ss'} 
        // { title : 'Growth', key : 'growth', value : 'growth'} 

var MeasureToggleGroup = connectMap({
          value : 'activeData'
        })(ToggleBarRaw);


// Tooltip Setup
    var Tooltip = connect(function(state) {
       if (!datasets[state.activeData]) {
        var metadata = datasets[state.activeData];
        console.log(state.tooltipContents.ISO2)
        return {
          show : countries.hasOwnProperty(state.tooltipContents && state.tooltipContents.ISO2) ? state.tooltipShow : false,
          mouseX : state.tooltipContents && state.tooltipContents.mouseX,
          mouseY : state.tooltipContents && state.tooltipContents.mouseY,
          template : function() {
            // if(!state.tooltipContents) { return ''; }
            var key = state.tooltipContents.ISO;
            var countryName = key ? countries[key].name.ISO2 : '';
            var datum = state.tooltipContents[state.activeData];
            return (<div>
                      <h4>{countryName}</h4>
                      <div>{metadata.formatter(datum)}{metadata.unit}</div>
                     </div>);
        }
      }
    } 
    return {};

    })(TooltipRaw);


  var GradientScale = connect(function(state) {
    var set = datasets[state.activeData];
    return {
      scale : set.scale,
      tag : set.tag || null,
      formatter : set.tagFormatter || set.formatter,
      mod : set.mod || null,
      modDomain : set.modDomain || null
    };
  })(GradientScaleRaw);

  class TextSection extends React.Component {
      static get defaultProps() {
      return {
      text : 'foo'
      };
      }
      render() {
      return (<span className='legend-label'>{this.props.text}</span>);
      }
      }

  var UnitText = connect(function(state) {
      return {
      text : datasets[state.activeData].unit
      };
      })(TextSection);



class Chart extends ChartContainer {
  
  render() {
    var measureToggleProps = {
      items : [
        { title : 'GDPPP_2015', key : 'GDPPP_2015', value : 'GDPPP_2015' },
        { title : 'Unemployment_2015', key : 'Unemployment_2015', value : 'Unemployment_2015' },
        { title : 'Primary_Balance_2015', key : 'Primary_Balance_2015', value : 'Primary_Balance_2015' },
        { title : 'GDPLatest_2015', key : 'GDPLatest_2015', value : 'GDPLatest_2015' },
        { title : 'GDP_2016', key : 'GDP_2016', value : 'GDP_2016' },
        { title : 'GDP_2017', key : 'GDP_2017', value : 'GDP_2017' },
        ],
      action : function (v) { store.dispatch(updateActiveData(v)); }
    };

    var mapHeight = 500;
    var mapWidth = 595;

    var mapProps = {
      duration : null,
      height : mapHeight, 
      layerHandlers : {
        countries : {
          mouseenter : function(d) {
            var key = d.properties.ISO2;
            var data = store.getState().data.find(v => v.ISO2 === key);

            data = Im.extend(data, {
              mouseX : d3.event.clientX,
              mouseY : d3.event.clientY
            });
            store.dispatch(showTooltip(data));
          },
          mouseleave : function(d) {
            store.dispatch(hideTooltip());
          }
        }
      }
    };

    var gradientScaleProps = {
      margin : [500, 200, 30]
    };
    

    return(
      <div className='chart-container'>
        <TiedHeader title="Global emissions" />
        <MeasureToggleGroup {...measureToggleProps} />
        <svg height={mapHeight + 50} width="595">
          <D3Map {...mapProps} />
          <GradientScale {...gradientScaleProps} />
        </svg>
        <UnitText />
        <div className="note"><super>†</super>$2012 at purchasing-power parity</div>
        <div className="note">*CO<sub>2</sub>, CH<sub>4</sub>, N<sub>2</sub>O, F-gases</div>
        <div className="source">Source: Emission Database for Global Atmospheric Research</div>
        <Tooltip />
      </div>
  
      );
  }
};


// define default chart properties
  var props = {
    height : 320
  };

// Use provider
var chart = React.render(
  <Provider store={store}>
    {() => <Chart {...props} />}
  </Provider>, document.getElementById('interactive'));



// Load in TopoJson Data
function fetchTopojson(file, action, group) {
  d3.json(file, function(error, data) {
    // console.log(topojson.feature(data, data.objects[group]).features);
    store.dispatch(action(topojson.feature(data, data.objects[group]).features));
  });
}

fetchTopojson('./data/output_small.json', updateCountries, 'output');




var datapath = "./data/dummyEu.csv";

d3.csv(datapath, function (error, data) {
    // const DATA_SERIES = ["GDPPP_2015", "Unemployment_2015"];
    // const DATA_SERIES = ["GDP", "Unemployment", "UnemploymentYouth", "PublicDept", "BudgetBalance", "PrimaryBalance", "GDPGrowth", "GDP2017", "GDP2018"]
    data = data.map(parseNumerics);
    // data.forEach(function () {
    //   return d.ISO2 = d.ISO2;
    // })

    // data = data.map(d => {
    // var values = DATA_SERIES.map(series => {
    //   var keyList = Object.keys(d).filter(k => k.split('_')[0] === series);
    //   var valueList = keyList.map(key => d[key]);
    //   var yearList = keyList.map(k => k.split('_')[1]);
    //   var obj = {};
    //   for (let i in yearList) {
    //     obj[yearList[i]] = valueList[i];
    //   }
    //   return obj;
    // });
    // var ret = { 'ISO' : d.ISO };

    // for (let i in values) {
    //   ret[DATA_SERIES[i]] = values[i];
    // }
    // return ret;
    // // console.log(data)
    // console.log(valueList)
    // });

 // console.log(data);

    store.dispatch(updateData(data));

});





