import React,{ Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { lat: null };

    window.navigator.geolocation.getCurrentPosition(
      position => {
        // we called setstate!!
        this.setState({ lat: position.coords.latitude });
      },
      error => console.info(error)
    );
  }
  // React says we have to define render!
  render() {


    return (
      <div>Latitude:{ this.state.lat }</div>
    )
  }
}

ReactDOM.render(<App />,document.getElementById('root'));