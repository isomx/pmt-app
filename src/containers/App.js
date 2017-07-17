/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { loadData } from '../actions/render';
import PropTypes from 'prop-types';
import Toolbar  from 'react-md/lib/Toolbars';
import cn from 'classnames';
import Button from 'react-md/lib/Buttons';
import TextField from 'react-md/lib/TextFields';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import MdTextField from '../components/MdTextField';
import DnDCell from '../components/DnDCell';
import DnDGrid from '../components/DnDGrid';
import { render as renderActions } from '../constants/ActionTypes';
import Login from './Login'
import isEmpty from 'lodash/isEmpty';
import { matchPath } from 'react-router-dom';


import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Media, { MediaOverlay } from 'react-md/lib/Media';


import componentFromStream from 'recompose/componentFromStream';
import mapPropsStream from 'recompose/mapPropsStream';
import renderComponent from 'recompose/renderComponent';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import { Observable } from 'rxjs/Observable';

const render = props => {

}

const imgSrc = 'http://freedomlifestylenetwork.com/app/img/screenshots/s_74_0.jpg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: null,
    };
    // if (isEmpty(this.props.dataFlat)) this.props.loadData('/');
    const do1 = (v = 0) => {console.log('do1 called'); return v + 1};
    const do2 = (v) => {console.log('do2 called'); return v + 2};
    const do3 = (v) => {console.log('do3 called'); return v + 3};
    const result = compose(do3, do2, do1)(1);
    console.log('result = ', result);
    /**
    const funcs = [do1, do2, do3];
    const stream$ = Observable.from(funcs)
      .map(func => func())
      .scan((acc, curr) => {
        console.log('acc = ', acc);
        acc.push(curr);
        return acc;
      }, [])
    ;
    const subscribe = stream$.subscribe(
      v => console.log('subscribe value = ', v),
      err => console.log('subscribe err = ', err),
      () => console.log('subscribe complete')
    );
     **/

  }

  buildComponents(data) {

  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps = ', nextProps);
    this.setState({render: nextProps.dataFlat});
  }

  render() {
    const setupProps = {
      label: 'My Form Label',
      id: 'MyFieldId',
      name: 'myField',
    };
    //return MdTextField(setupProps);
    const Comp = MdTextField();
    /**
     *
     * <div className="md-cell md-cell--6-tablet md-cell--4">
     <Comp {...setupProps} />
     </div>
     */
    return (
      <div>
        <div className="md-grid md-grid--40-24">
          <div className="md-cell md-cell--6 md-cell--order-3 md-cell--4-offset md-cell--2-tablet-offset">
            <Card className="md-block-centered" raise={true}>
              <Media>
                <img src={imgSrc} role="presentation"/>
              </Media>
              <CardTitle
                title="Card Title"
                subtitle="Card Subtitle"
              />
              <CardActions expander>
                <Button primary raised label="Funnels Page"/>
                <Button flat label="Action 2"/>
              </CardActions>
            </Card>
          </div>
          <div className="md-cell md-cell--4 md-cell--order-2">
            <Card className="md-block-centered" raise={true}>
              <Media>
                <img src={imgSrc} role="presentation"/>
              </Media>
              <CardTitle
                title="Card Title"
                subtitle="Card Subtitle"
              />
              <CardActions expander>
                <Button flat label="Funnels Page"/>
                <Button flat label="Action 2"/>
              </CardActions>
            </Card>
          </div>
          <div className="md-cell md-cell--6 md-cell--order-1">
            <Card className="md-block-centered" raise={true}>
              <Media>
                <img src={imgSrc} role="presentation"/>
              </Media>
              <CardTitle
                title="Card Title"
                subtitle="Card Subtitle"
              />
              <CardActions expander>
                <Button primary flat label="Funnels Page"/>
                <Button flat label="Action 2"/>
              </CardActions>
            </Card>
          </div>


        </div>

        <div className="md-grid md-grid--40-24">
          <div className="md-cell md-cell--12 md-cell-block-centered">
            <div className="md-cell--4 md-cell--8-tablet">
            <p><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam cupiditate natus pariatur sapiente? Delectus dignissimos ea enim facere harum, nulla odit reiciendis sequi temporibus veniam? Fugit perferendis perspiciatis placeat tenetur.</span><span>Doloremque enim esse ex magni nihil nobis perferendis sapiente vel. Ad atque beatae, delectus eligendi enim, eum in labore libero minima, nesciunt non quisquam reiciendis veritatis! Architecto maiores praesentium ullam.</span><span>A animi assumenda autem cumque dicta distinctio eos excepturi hic impedit inventore iusto labore, magni molestiae perferendis placeat possimus quasi quos ratione repellendus temporibus tenetur voluptatem, voluptates. Autem, cum ipsum!</span><span>Amet commodi cupiditate delectus iste maiores minus nisi non perspiciatis provident sunt? Dolor ex, inventore nihil pariatur quasi quod tenetur! Ad at ipsa labore libero odio quaerat, rem similique! Sit!</span><span>Ab alias, officiis! Accusamus, aliquam aliquid amet animi aperiam cum doloremque error eveniet explicabo id ipsam laboriosam libero, magnam maxime nostrum perferendis quibusdam rem, reprehenderit sunt totam ullam veritatis voluptates?</span><span>Adipisci aspernatur debitis doloremque earum eius, fugit incidunt minima, perferendis quam quas repudiandae soluta voluptate, voluptatibus? Facere inventore pariatur veritatis vero voluptatum! Culpa debitis ex iure laboriosam minus nostrum pariatur!</span><span>Accusantium ad aperiam atque, consequatur eligendi fuga fugiat, fugit id maiores neque nobis officia pariatur ratione reprehenderit veniam vero voluptatum! Aut, deserunt dolores doloribus expedita fuga magnam minus perspiciatis quas.</span><span>Architecto consectetur culpa deleniti exercitationem, fugit illo nesciunt nisi quaerat quo soluta. At blanditiis ducimus est eum mollitia nostrum quia quibusdam totam? Aperiam ipsum nam nemo qui? Nostrum, praesentium, veritatis.</span><span>Ab aspernatur beatae cumque, deserunt dignissimos laboriosam modi molestias ratione rem veniam! Consectetur distinctio dolores, eaque facere illo obcaecati saepe soluta vero! Consequatur corporis deleniti illum, itaque maiores sed veniam?</span><span>Asperiores distinctio dolorem modi officia praesentium sapiente tempora voluptates. Dicta eum impedit incidunt, iusto laudantium odit! Culpa cumque dolorem doloremque, eum expedita facere facilis, ipsam, iusto nesciunt optio quas sed!</span></p>
              <div className="md-cell--4">
                <p><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam cupiditate natus pariatur sapiente? Delectus dignissimos ea enim facere harum, nulla odit reiciendis sequi temporibus veniam? Fugit perferendis perspiciatis placeat tenetur.</span><span>Doloremque enim esse ex magni nihil nobis perferendis sapiente vel. Ad atque beatae, delectus eligendi enim, eum in labore libero minima, nesciunt non quisquam reiciendis veritatis! Architecto maiores praesentium ullam.</span><span>A animi assumenda autem cumque dicta distinctio eos excepturi hic impedit inventore iusto labore, magni molestiae perferendis placeat possimus quasi quos ratione repellendus temporibus tenetur voluptatem, voluptates. Autem, cum ipsum!</span><span>Amet commodi cupiditate delectus iste maiores minus nisi non perspiciatis provident sunt? Dolor ex, inventore nihil pariatur quasi quod tenetur! Ad at ipsa labore libero odio quaerat, rem similique! Sit!</span><span>Ab alias, officiis! Accusamus, aliquam aliquid amet animi aperiam cum doloremque error eveniet explicabo id ipsam laboriosam libero, magnam maxime nostrum perferendis quibusdam rem, reprehenderit sunt totam ullam veritatis voluptates?</span><span>Adipisci aspernatur debitis doloremque earum eius, fugit incidunt minima, perferendis quam quas repudiandae soluta voluptate, voluptatibus? Facere inventore pariatur veritatis vero voluptatum! Culpa debitis ex iure laboriosam minus nostrum pariatur!</span><span>Accusantium ad aperiam atque, consequatur eligendi fuga fugiat, fugit id maiores neque nobis officia pariatur ratione reprehenderit veniam vero voluptatum! Aut, deserunt dolores doloribus expedita fuga magnam minus perspiciatis quas.</span><span>Architecto consectetur culpa deleniti exercitationem, fugit illo nesciunt nisi quaerat quo soluta. At blanditiis ducimus est eum mollitia nostrum quia quibusdam totam? Aperiam ipsum nam nemo qui? Nostrum, praesentium, veritatis.</span><span>Ab aspernatur beatae cumque, deserunt dignissimos laboriosam modi molestias ratione rem veniam! Consectetur distinctio dolores, eaque facere illo obcaecati saepe soluta vero! Consequatur corporis deleniti illum, itaque maiores sed veniam?</span><span>Asperiores distinctio dolorem modi officia praesentium sapiente tempora voluptates. Dicta eum impedit incidunt, iusto laudantium odit! Culpa cumque dolorem doloremque, eum expedita facere facilis, ipsam, iusto nesciunt optio quas sed!</span></p>
              </div>
            </div>

          </div>
          <div className="md-cell md-cell--8"><p><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam cupiditate natus pariatur sapiente? Delectus dignissimos ea enim facere harum, nulla odit reiciendis sequi temporibus veniam? Fugit perferendis perspiciatis placeat tenetur.</span><span>Doloremque enim esse ex magni nihil nobis perferendis sapiente vel. Ad atque beatae, delectus eligendi enim, eum in labore libero minima, nesciunt non quisquam reiciendis veritatis! Architecto maiores praesentium ullam.</span><span>A animi assumenda autem cumque dicta distinctio eos excepturi hic impedit inventore iusto labore, magni molestiae perferendis placeat possimus quasi quos ratione repellendus temporibus tenetur voluptatem, voluptates. Autem, cum ipsum!</span><span>Amet commodi cupiditate delectus iste maiores minus nisi non perspiciatis provident sunt? Dolor ex, inventore nihil pariatur quasi quod tenetur! Ad at ipsa labore libero odio quaerat, rem similique! Sit!</span><span>Ab alias, officiis! Accusamus, aliquam aliquid amet animi aperiam cum doloremque error eveniet explicabo id ipsam laboriosam libero, magnam maxime nostrum perferendis quibusdam rem, reprehenderit sunt totam ullam veritatis voluptates?</span><span>Adipisci aspernatur debitis doloremque earum eius, fugit incidunt minima, perferendis quam quas repudiandae soluta voluptate, voluptatibus? Facere inventore pariatur veritatis vero voluptatum! Culpa debitis ex iure laboriosam minus nostrum pariatur!</span><span>Accusantium ad aperiam atque, consequatur eligendi fuga fugiat, fugit id maiores neque nobis officia pariatur ratione reprehenderit veniam vero voluptatum! Aut, deserunt dolores doloribus expedita fuga magnam minus perspiciatis quas.</span><span>Architecto consectetur culpa deleniti exercitationem, fugit illo nesciunt nisi quaerat quo soluta. At blanditiis ducimus est eum mollitia nostrum quia quibusdam totam? Aperiam ipsum nam nemo qui? Nostrum, praesentium, veritatis.</span><span>Ab aspernatur beatae cumque, deserunt dignissimos laboriosam modi molestias ratione rem veniam! Consectetur distinctio dolores, eaque facere illo obcaecati saepe soluta vero! Consequatur corporis deleniti illum, itaque maiores sed veniam?</span><span>Asperiores distinctio dolorem modi officia praesentium sapiente tempora voluptates. Dicta eum impedit incidunt, iusto laudantium odit! Culpa cumque dolorem doloremque, eum expedita facere facilis, ipsam, iusto nesciunt optio quas sed!</span></p></div>

        </div>
      </div>
    )

    return (
      <Comp {...setupProps} />
    );
    console.log('this.props = ', this.props);

    const match = matchPath('/hello?something=yes', {
      path: '/hello',
      exact: false,
    });
    console.log('match = ', match);
    if (this.props.processing) {
      return (
        <div>
          <Login />
          <CircularProgress id="appLoading" scale={5} />
        </div>
      );
    }

    if (this.state.render) {
      return (
        <div>
          <Login/>
          <h1>got the data!</h1>
        </div>
      );
    }

    if (this.props.errors) {
      return (
        <div>
          <Login />
          <h1>Error...</h1>
        </div>
      );
    }
  }


}

//@DragDropContext(HTML5Backend)
const App2 = props => {
  //console.log('props = ', props);
  //const Component = MdTextField({label: "First Name", id: "fname", name: 'fname'})
  const Component = MdTextField()
  return (
    <div>
      <DnDGrid>
        <DnDCell>
          <Component label="First Name" id="fname" name="fname" />
        </DnDCell>
        <DnDCell>
          <p>My Second Component</p>
        </DnDCell>
        <DnDCell>
          <p>My Third Component</p>
        </DnDCell>
      </DnDGrid>
    </div>
  );
}

const mapStateToProps = (store, ownProps) => ({...store.render});
const mapDispatchToProps = (dispatch, state) => ({
  loadData: () => dispatch({type: renderActions.LOAD_DATA}),
});

//export default DragDropContext(HTML5Backend)(connect(mapStateToProps, mapDispatchToProps)(App));
export default connect(mapStateToProps, mapDispatchToProps)(App);
//export default connect(mapStateToProps, mapDispatchToProps)(App);
