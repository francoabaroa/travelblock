import { GoogleApiWrapper } from 'google-maps-react'
import React, { Component } from 'react';
import TMap from './TMap.js'

import TravelblockConstants from '../constants/TravelblockConstants.js'

class TMapContainer extends Component {
  render() {
    return (
      <div
        className="TMapContainer"
        style={{
          display: TravelblockConstants.FLEX,
          justifyContent: TravelblockConstants.CENTER
        }}>
        <TMap google={this.props.google} cities={this.props.cities} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'API_KEY',
})(TMapContainer)
