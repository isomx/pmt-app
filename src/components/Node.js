/**
 * Created by Josh on 3/27/2017.
 */
/* eslint-disable */
import React, {Component} from "react";
import NodeMenu from "./NodeMenu";
import { MdTransitionEvent, MdTransitionAnchor, MdTransitionElement, transitionTypes } from '../lib/systemManager';
import Button from 'react-md/lib/Buttons';
import cn from 'classnames';
import { Observable } from 'rxjs/Observable';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';
export default class Node extends Component {
  constructor(props) {
    super(props);
    this.handleMouse = this.handleMouse.bind(this);
    this.enterNode = this.enterNode.bind(this);
  }
  componentDidMount() {

  }

  updateTree(editData) {
    //editData[190].parentId = 182;
    this.props.updateTree(editData);
  }
  handleMouse(e) {
    e.stopPropagation();
  }

  enterNode(e) {
    console.log('starting API Call');
    Observable.ajax({
      url: 'http://pmt.dev/wp-json/sysapi/v1/users',
      //url: 'http://localhost:80/pmt',
      method: 'GET',
      responseType: 'json',
      crossDomain: true,
      withCredentials: true,
      //createXHR: () => new XMLHttpRequest(),
    }).subscribe(
      (data) => {
        console.log('data = ', data);
      },
      (err) => {
        console.log('err = ', err);
      },
      () => {
        console.log('complete');
      }
    );
    //this.props.onEnterNode(this.props.node.id);
  }
  /**
   return(

   <div className={'orgChart'} style={{padding: '0px', minHeight: '0px', verticalAlign: 'middle'}}>
   <div className={'node ' + colorClass} ref={(elem) => { this.props.registerElem(nodeData.id, elem); }}>
   <div className="title">{nodeData.name}</div>
   <div className="content">{nodeData.name}</div>
   </div>
   </div>
   );

   <NodeMenu node={nodeData} />
   **/

  render() {
    const {nodeData} = this.props;
    if (!nodeData) return null;
    //const colorClass = this.props.codeData[nodeData.code].css;
    const containerStyle = {
      zIndex: 4,
      width: '316px',
      height: '154px',
      marginLeft: 'auto',
      marginRight: 'auto',
      position: 'relative',
    };
    const nodeStyle = {
      position: 'relative',
      width: '300px',
      height: '130px',
      zIndex: 4,
      backgroundColor: '#fff',
      margin:`${0}px`,
    };
    const leftSection = {
      width: '70%',
      float: 'left',
      height: '130px',
      padding: '12px',
    };
    const rightSection = {
      width: '30%',
      float: 'right',
      height: '130px',
      backgroundColor: '#2f5f80',
      //borderLeft: '#2f5f80 2px solid',
      padding: '12px',
    };
    const backgroundStyle1 = {
      position: 'absolute',
      width: '292px',
      height: '122px',
      backgroundColor: '#fff',
      zIndex: 3,
      top: `${20}px`,
      left: `${20}px`,
      margin:`${0}px`,
    };
    const backgroundStyle2 = {
      position: 'absolute',
      width: '284px',
      height: '114px',
      top: `${40}px`,
      left: `${40}px`,
      /**
      width: '292px',
      height: '122px',
      top: `${-20}px`,
      left: `${-10}px`,
       **/
      backgroundColor: '#fff',
      zIndex: 2,
      margin:`${0}px`,
    };
    const colorClass = '';
    return(
      <MdTransitionAnchor name="node171" findById="node171" render={(resp) =>
        <MdTransitionElement name="common_node171" findById="node171" render={(d) =>
          <MdTransitionEvent name="event_node171" render={(props) =>
            <div style={containerStyle}>
              <div style={nodeStyle} className="md-paper md-paper--4">
                <div style={leftSection}>
                  <p>{nodeData.name}</p>
                  <Button label="Enter" primary raised onClick={this.enterNode}></Button>
                </div>
                <div style={rightSection}>
                  <p style={{color: '#fff'}}>Funnel</p>
                </div>
              </div>
              <div style={backgroundStyle1} className={cn('node', colorClass, 'md-paper md-paper--3')}/>
              <div style={backgroundStyle2} className={cn('node', colorClass, 'md-paper md-paper--2')}/>
            </div>
          }/>
        }/>
      } />

    );





    if (nodeData.id === 171) {

      if (this.props.enterNode && this.props.recordPosition) {
        const recordPosition = this.props.recordPosition;
        const enterNode = this.props.enterNode;

        return (
          <Card id="node171" className={'node ' + colorClass}>
            <NodeMenu node={nodeData}/>
            <CardTitle title={nodeData.name}/>
            <CardText>
              <div style={{display: 'block'}}>{nodeData.name}</div>
              <div style={{display: 'block', width: '100%'}}>
                <button onClick={() => {
                  recordPosition();
                  enterNode();
                }}>ENTER THIS NODE
                </button>
              </div>

            </CardText>
          </Card>
        );
      } else {
        return (
          <Card id="node171" className={'node ' + colorClass}>
            <NodeMenu node={nodeData}/>
            <CardTitle title={nodeData.name}/>
            <CardText>
              <div style={{display: 'block'}}>{nodeData.name}</div>
              <div style={{display: 'block', width: '100%'}}>
                <button>ENTER THIS NODE FLAT
                </button>
              </div>

            </CardText>
          </Card>
        );
      }
    }



    return(
      <div className={'node ' + colorClass} ref={(elem) => { this.props.registerElem(nodeData.id, elem); }} onMouseDown={this.handleMouse} onTouchStart={this.handleMouse}>
        <NodeMenu node={nodeData} />
        <div className="title">{nodeData.name}</div>
        <div className="content">
          <div style={{display: 'block'}}>{nodeData.name}</div>
          <div style={{display: 'block', width: '100%'}}>
            <button onClick={this.enterNode}>Enter</button>
          </div>
        </div>
      </div>
    );
  }
}