import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Result extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="Result">
        <p>{this.props.name}</p>
      </div>
    )
  }
}

class ResultGrid extends Component {
  constructor(props) {
    super(props);
}

  render() {
    let numResults = this.props.numResults;
    let output = [];

    var i;
    for(i = 0; i < numResults; i++) {
      output.push(<Result key={i} name={this.props.values[i]}/>);
    }
    return (
      <div className="ResultGrid">
        {output}
      </div>
    )
  }
}
class SearchBox extends Component{
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    console.log('handling change...');

    let value = e.target.value;
    console.log('value: ' + value);

    this.props.onChange(value);
  }
  render() {
    return (
    <div className="SearchBox">
    <input className="search" type="search" onChange={this.handleChange}/>
    </div>
    );
  }
}

class SearchBoxContainer extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      numResults: 0,
    };
    this.updateValue = this.updateValue.bind(this);
    this.runApi = this.runApi.bind(this);
  }

  updateValue(newValue) {
    console.log('updating value...');

    this.setState({value: newValue});

    this.runApi(newValue);
  }

  componentDidUpdate() {
    console.log(this.state.value);
  //  this.runApi();
  }

  runApi(newValue) {
    console.log('running api...');
    let test = ['facebook', 'ford', 'amazon', 'amazing company', 'apple', 'appley'];
    let newNumResults = 0;
    let values = [];
    var i;
    for(i = 0; i < test.length; i++) {
      if(test[i].indexOf(newValue) === 0) {
        newNumResults++;
        values.push(test[i]);
      }
    }
    console.log('values: ' + values);
    console.log('new num results: ' + newNumResults);
    this.setState({numResults: newNumResults});
    this.props.onUpdateInfo(values, newNumResults);
  }

  render() {
    return (
    <div>
    <SearchBox onChange={this.updateValue} />
    </div>
    )
  }

}


class App extends Component {
	constructor() {
		super();
		this.state = {
      values: [],
      numResults: 0,
		}
		this.handleInfoUpdate = this.handleInfoUpdate.bind(this);
	}

	handleInfoUpdate(newValue, newNumResults) {
    console.log('handling info update...');


    this.setState({values: newValue});
    this.setState({numResults: newNumResults});
	}

  render() {
    return (
      <div className="App">
          <header>
            <span>Stock View</span>
          </header>
		      <SearchBoxContainer onUpdateInfo={this.handleInfoUpdate} />
          <ResultGrid values={this.state.values} numResults={this.state.numResults} />
      </div>
    );
  }
}

export default App;
