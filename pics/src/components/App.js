import React, { Component } from 'react';
import SearchBar from './SearchBar';

class App extends Component {
  onSearchSubmit () {
    console.info('通過')
  }
  render () {
    return (
      <div className="ui container" style={{ marginTop: '10px' }}>
        <SearchBar onSubmit={this.onSearchSubmit} />
      </div>
    );
  }
}

export default App;