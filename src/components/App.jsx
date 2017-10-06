import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    const {location} = this.props;
    if (!location.hash) {
      window.location = window.server + '/hostLogin';
    }
  }

  render(){
    return (
      <div>
        <Banner/>
        <MuiThemeProvider>
          <Navbar/>
        </MuiThemeProvider>
        <Container/>
      </div>
    );
  }
}

export default App;
window.App = App;