import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class SearchBox extends React.Component{
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

class SearchBoxContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
    };
    this.updateValue = this.updateValue.bind(this);
    this.runApi = this.runApi.bind(this);
  }
  
  updateValue(newValue) {
    console.log('updating value...');

    this.setState({value: newValue});
  }

  componentDidUpdate() {

  }

  runApi() {
    console.log('running api...');

  }    
  
  render() {
    return (
    <div>
    <SearchBox onChange={this.updateValue}/>
    </div>
    )
  }
  
}


class App extends Component {
	constructor() {
		super();
		this.state = {
			
		}
		this.handleInfoUpdate = this.handleInfoUpdate.bind(this);
	}

	handleInfoUpdate() {

	}
	
  render() {
    return (
      <div className="App">
		<SearchBoxContainer onUpdateInfo={this.handleInfoUpdate} />
      </div>
    );
  }
}

export default App;
