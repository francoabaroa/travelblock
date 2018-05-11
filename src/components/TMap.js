import ReactDOM from 'react-dom'
import React, { Component } from 'react';

import TravelochainConstants from '../constants/TravelochainConstants.js'

class TMap extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.cities !== this.props.cities) {
      this.loadMap();
    }
  }

  cleanUpDate(date) {
    let cleanDate = [];
    let stringDate = date.toString();
    for (let index = 0; index < stringDate.length; index++) {
      if (index <= 3) {
        cleanDate.push(stringDate[index]);
        if (index === 3) {
          cleanDate.push('-');
        }
      } else if (index > 3 && index <= 5) {
        cleanDate.push(stringDate[index]);
        if (index === 5) {
          cleanDate.push('-');
        }
      } else if (index > 5 && index <= 7) {
        cleanDate.push(stringDate[index]);
      }
    }
    return cleanDate.join('');
  }

  loadMap() {
    if (this.props && this.props.google) {
      const {google} = this.props;
      const maps = google.maps;
      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);
      const mapConfig = Object.assign({}, {
        center: {
          lat: TravelochainConstants.MAP_LAT,
          lng: TravelochainConstants.MAP_LNG
        },
        zoom: TravelochainConstants.MAP_ZOOM,
        mapTypeId: TravelochainConstants.MAP_TYPE_ID
      });

      this.map = new maps.Map(node, mapConfig);
      this.props.cities.forEach(location => {
        let startDate = this.cleanUpDate(location.startDate);
        let endDate = this.cleanUpDate(location.endDate);
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng),
          },
          map: this.map,
          title: location.name
        });
        const infowindow = new google.maps.InfoWindow({
          content: `<h3>${location.name} (${location.country})</h3>
          <h4>From: ${startDate}</h4>
          <h4>To: ${endDate}</h4>
          <h4>Notes: ${location.notes}</h4>`
        });

        marker.addListener('click', function() {
          infowindow.open(this.map, marker);
        });
      });

    }
  }

  render() {
    const style = {
      height: TravelochainConstants.MAP_HEIGHT,
      width: TravelochainConstants.MAP_WIDTH,
    }

    return (
      <div ref="map" style={style}>
        {TravelochainConstants.LOADING_MAP}
      </div>
    );
  }
}

export default TMap;
