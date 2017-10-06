import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Container extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <Switch>
          <Route exact path='/' component={Playlist}/>
          <Route exact path='/signup' component={Signup}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/search' component={Search}/>
        </Switch>
      </MuiThemeProvider>
    )
  }
}
export default Container;
window.Container = Container;
// TODO: Review how react router should be implemented with a node express backend