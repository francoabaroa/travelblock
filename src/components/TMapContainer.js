import { GoogleApiWrapper } from 'google-maps-react'
import React, { Component } from 'react';
import TMap from './TMap.js'

import TravelochainConstants from '../constants/TravelochainConstants.js'

class TMapContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="TMapContainer"
        style={{
          display: TravelochainConstants.FLEX,
          justifyContent: TravelochainConstants.CENTER
        }}>
        <TMap google={this.props.google} cities={this.props.cities} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'SECRET_KEY',
})(TMapContainer)
