import React, { Component } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import UtilsManager from '../../../singletons/UtilsManager.js';

const titleStyle = {
  color: "#222225",
  font: "Lato",
  textAlign: "center",
}

const root = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
  marginTop: 20,
}

const gemLabelStyle1 = {
  fontWeight: 'bold',
  color:'#9A9B9C',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

const gemLabelStyle2 = {
  fontWeight: 'bold',
  color:'#229CD2',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

const gemLabelStyle3 = {
  fontWeight: 'bold',
  color:'#FF0081',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

const gemLabelStyle4 = {
  fontWeight: 'bold',
  color:'#974BFF',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

const gemLabelStyle5 = {
  fontWeight: 'bold',
  color:'#95D601',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

const gemLabelStyle6 = {
  fontWeight: 'bold',
  color:'#FFC842',
  font: "Lato",
  textAlign: "center",
  fontSize: 30,
}

class ContributeGifAnimationModal extends Component {
  constructor(props) {
    super(props);

    this.renderAnimation = this.renderAnimation.bind(this);
  }

  renderAnimation(gems) {
    var style = gemLabelStyle1;
    var src = '../../../../../images/gem_1_animated.gif';
    if (gems < 100) {
      style = gemLabelStyle1;
      src = '../../../../../images/gem_1_animated.gif';      
    } else if (gems < 1000) {
      style = gemLabelStyle2;
      src = '../../../../../images/gem_2_animated.gif';
    } else if (gems < 5000) {
      style = gemLabelStyle3;
      src = '../../../../../images/gem_3_animated.gif';
    } else if (gems < 10000) {
      style = gemLabelStyle4;
      src = '../../../../../images/gem_4_animated.gif';
    } else if (gems < 25000) {
      style = gemLabelStyle5;
      src = '../../../../../images/gem_5_animated.gif';
    } else if (gems >= 25000) {
      style = gemLabelStyle6;
      src = '../../../../../images/gem_6_animated.gif';
    }

    return (
      <div>
        <img
          style={{width: '100%'}}
          src={src}/>
        <Typography style={style}>
          {"You just contributed " + UtilsManager.convertToCommaString(gems) + " Gems!"}
        </Typography>
      </div>
    );
  }

  render() {
		return (
      <div style={{width: 300}}>
        {this.renderAnimation(this.props.gems)}
      </div>
    )
  }
}

export default ContributeGifAnimationModal;
