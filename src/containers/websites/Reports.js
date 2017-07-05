import React, { Component } from 'react';
import { connect } from 'react-redux';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteId: 0,
    };
  }

  render() {
    return(
      <div key="new4241">
        <h3>Websites - Reports</h3>
        <div style={{ margin: '15px' }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, recusandae, sunt! Ab consequuntur
            corporis deserunt dolor ducimus earum facere, labore, molestias necessitatibus non nulla porro sit tempora
            voluptas voluptatum! Minima.
        </div>
        <div style={{ margin: '15px' }}>Ab, cum cumque delectus eos est ipsum iure, laborum nobis numquam possimus quod repellendus tempore?
          Eaque est fugiat neque quos reiciendis. Blanditiis consequuntur ea facere facilis mollitia unde velit
          voluptatibus.
        </div>
        <div style={{ margin: '15px' }}>A accusamus ad architecto assumenda atque blanditiis cum deserunt dicta dolore doloremque ea, eius est
          eveniet expedita facere hic libero maxime natus necessitatibus nihil omnis quas, quo recusandae sunt, totam.
        </div>
        <div style={{ margin: '15px' }}>Ab architecto aspernatur consequuntur, corporis cupiditate delectus dolorem dolores eligendi eos et
          eveniet excepturi exercitationem fugit, illo laboriosam minima molestias necessitatibus nemo nesciunt
          perferendis placeat quae quaerat, quasi recusandae totam.
        </div>
        <div style={{ margin: '15px' }}>Architecto aut, consequuntur dignissimos distinctio doloribus ducimus error explicabo facilis fugiat,
          laborum maxime minima molestias nemo obcaecati officia perspiciatis quod recusandae sed, sequi voluptatum.
          Ad aperiam temporibus ut. Labore, officia?
        </div>
      </div>
    );
  }
}


function mapStateToProps(store, ownProps) {
  return {};

}

function mapDispatchToProps(dispatch, state) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports)
