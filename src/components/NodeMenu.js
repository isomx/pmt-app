/**
 * Created by Josh on 4/4/2017.
 */
/* eslint-disable*/
import React, {Component} from "react";

export default class NodeMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
    this.onTriggerClick = this.onTriggerClick.bind(this);
  }
  componentDidMount() {
  }

  onTriggerClick() {
    console.log('trigger click!');
    if (this.state.active) {
      this.setState({active: false});
    } else {
      this.setState({active: true});
    }
  }

  render() {
    const {node} = this.props;
    const classNames = {
      radialMenu: this.state.active ? 'radialMenu active' : 'radialMenu',
    }
    return(
      <div className="menuContainer">
        <div className={classNames.radialMenu}>
          <div className="btn trigger group" onClick={this.onTriggerClick}>
            <span className="line"></span>
          </div>
          <div className="icons">
            <div className="rotater">
              <div className="btn btn-icon add_action group">
                <i className="fa fa-plus"></i>
              </div>
            </div>
            <div className="rotater">
              <div className="btn btn-icon edit_action group">
                <i className="fa fa-edit" title="add"></i>
              </div>
            </div>
            <div className="rotater">
              <div className="btn btn-icon focus_action group">
                <i className="fa fa-sitemap"></i>
              </div>
            </div>
            <div className="rotater">
              <div className="btn btn-icon delete_action group">
                <i className="fa fa-times"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}