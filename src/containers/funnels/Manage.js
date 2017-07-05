/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'react-md/lib/Papers/Paper';

export default class Manage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runCount: 0,
    };
  }

  componentWillAppear(callback) {
    console.log('Manage - Will Appear');
    callback();
  }

  componentWillEnter(callback) {
    console.log('Manage - Will Enter');
    callback();
  }

  componentWillLeave(callback) {
    console.log('Manage - Will Leave');
    callback();
  }
// <div key="3891" style={{display: 'block', position: 'relative', backgroundColor: '#fff'}} onClick={this.props.doNav}>
  render() {
    return(
      <section  className="md-grid md-grid--40-24">
        <div className="md-cell md-cell--12">
        <Paper>
          <div style={{backgroundColor: '#fff'}}>
        <h3>Funnels - Manage</h3>
        <div>
          <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. In maxime perferendis ullam. Assumenda at
            consequatur delectus, distinctio eveniet, facilis fugiat fugit inventore laudantium nisi optio provident quo
            quos ut voluptatem.
          </div>
          <div>Adipisci aspernatur autem blanditiis corporis dolorem doloremque exercitationem illum, incidunt inventore
            nemo numquam pariatur quam qui quia quos ratione reprehenderit repudiandae saepe, similique veniam?
            Architecto consequuntur fuga natus numquam sunt?
          </div>
          <div>Accusamus amet asperiores distinctio dolorum eaque enim eum explicabo fugiat laborum molestias nemo
            nesciunt nihil, obcaecati pariatur quae quam repudiandae tempora tempore totam vitae. Dicta ducimus eum
            magnam quod voluptatum!
          </div>
          <div>Aspernatur, aut enim ex excepturi illo natus nemo rerum? Accusamus commodi omnis qui reiciendis veniam! A
            amet consequuntur eius id praesentium rem veniam! A cupiditate dolore fuga nam provident voluptatem!
          </div>
          <div>Adipisci alias, aspernatur assumenda corporis culpa delectus dolore dolorem, dolorum est et illo iure
            maxime minima modi nisi officia quaerat quia quidem rem reprehenderit repudiandae rerum similique suscipit
            tenetur veniam.
          </div>
          <div>Architecto et illo ipsa nisi omnis quaerat quasi, qui reiciendis? Asperiores corporis culpa, dicta
            dignissimos dolorum eligendi esse est et iste iusto maiores nulla quae quos sed sint soluta vitae.
          </div>
          <div>Accusantium asperiores cupiditate facilis fuga nesciunt quos sed! Aliquam eos minima mollitia
            reprehenderit vel? Ad aut autem consequuntur dolore eaque fuga impedit itaque libero, magnam natus obcaecati
            odio, quisquam vitae!
          </div>
          <div>Ab corporis dolore hic necessitatibus voluptatem. Accusamus cumque est soluta velit voluptatibus. At cum
            cupiditate, distinctio exercitationem explicabo iure labore minus nemo nesciunt odio officia quas, quibusdam
            quos unde voluptatum?
          </div>
          <div>A ab adipisci, aperiam assumenda commodi cum deleniti dolor dolores, ea error ex fuga illo ipsum
            perspiciatis possimus quam recusandae repellendus rerum sequi soluta tempora tempore temporibus vero vitae
            voluptas.
          </div>
          <div>A, alias culpa eos harum illum iusto libero quae tenetur! Blanditiis consequatur error quos sapiente
            suscipit tempore vel! Culpa dolores explicabo facilis fuga illum maiores nostrum, quas quibusdam repellendus
            suscipit!
          </div>
        </div>
          </div>
        </Paper>
        </div>

      </section>
    );
  }
}


function mapStateToProps(store, ownProps) {
  return {};

}

function mapDispatchToProps(dispatch, state) {
  return {};
}

//export default connect(mapStateToProps, mapDispatchToProps)(Manage)
