import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import Manage from './websites/Manage';
import Reports from './websites/Reports';


class WebsitesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteId: 0,
    };
  }

  render() {
    return(
      <Route
        render={({ location }) => (
          <section className="md-grid md-grid--40-16">
            <section className="md-cell md-cell--12">
              <Route path="/websites/manage" component={Manage} />
              <Route path="/websites/reports" component={Reports} />
            </section>
          </section>
        )}
      />
    );
  }
}

/**
function mapStateToProps(store, ownProps) {
  return {};

}

function mapDispatchToProps(dispatch, state) {
  return {};

}
**/
export default withRouter(connect()(WebsitesPage))
