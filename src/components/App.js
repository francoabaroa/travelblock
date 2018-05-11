import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import React, { Component } from 'react';
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import TravelochainCityFactoryContract from '../build/contracts/TravelochainCityFactory.json'
import TMapContainer from './TMapContainer.js';
import TToolbar from './TToolbar.js';
import Web3 from 'web3'
import getWeb3 from '../utils/getWeb3'

import '../styles/App.css';
import TravelochainConstants from '../constants/TravelochainConstants.js'

const contract = require('truffle-contract');

/*global web3:true*/
/*eslint no-undef: "error"*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCityDetailsDialogOpen: false,
      addCityDialogOpen: false,
      cities: [],
      city: '',
      contractInstance: {},
      currentAccount: {},
      currentCity: {},
      /* YYYY-MM-DD Format */
      currentCityEndDate: '',
      currentCityNote: '',
      /* YYYY-MM-DD Format */
      currentCityStartDate: '',
      showCityConfirmationDialog: false,
      toolbarViewSelected: 1,
      unformattedCityEndDate: '',
      unformattedCityStartDate: '',
      web3: null,
    }
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      this.instantiateContract();
    })
    .catch((error) => {
      console.log(TravelochainConstants.WEB3_ERROR, error, arguments);
    })
  }

  instantiateContract() {
    /*
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    let travelochainCityFactoryInstance;
    const travelochainStorage = contract(TravelochainCityFactoryContract);
    travelochainStorage.setProvider(this.state.web3.currentProvider);
    this.state.web3.eth.getAccounts((error, accounts) => {
      travelochainStorage.deployed().then((instance) => {
        travelochainCityFactoryInstance = instance;
        return travelochainCityFactoryInstance.getCitiesByOwner(accounts[0]);
      }).then((result) => {
        for (let i = 0; i < result.length; i++) {
          travelochainCityFactoryInstance.cities(result[i].c[0]).then((result) => {
            let currentCity = [{
              name: result[0],
              lat: result[1],
              lng: result[2],
              country: result[3],
              notes: result[4],
              startDate: result[5].c[0],
              endDate: result[6].c[0],
            }];

            return this.setState({
              cities: this.state.cities.concat(currentCity),
              contractInstance: travelochainCityFactoryInstance,
              currentAccount: accounts[0],
            });
          });
        }
      })
    })
  }

  saveCityVisitedToContract = () => {
    let travelochainCityFactoryInstance;
    let name = this.state.currentCity.name;
    let lat = this.state.currentCity.location.lat;
    let lng = this.state.currentCity.location.lng;
    let country = this.state.currentCity.country;
    let notes = this.state.currentCityNote;
    let startDate = parseInt(this.state.currentCityStartDate.split('-').join(''));
    let endDate = parseInt(this.state.currentCityEndDate.split('-').join(''));
    return this.state.contractInstance.saveCityVisited(
      name,
      lat,
      lng,
      country,
      notes,
      startDate,
      endDate,
      {
        from: this.state.currentAccount,
        gas:3000000
      },
    ).then((result) => {
      return this.handleCityDialogClose(name, lat, lng, country, notes, startDate, endDate);
    });
  }

  cleanUpGeocodeResult(result) {
    let country, name;
    let lat = result.geometry.bounds.f;
    let lng = result.geometry.bounds.b;
    lat = (lat.b + lat.f)/TravelochainConstants.AVERAGE;
    lng = (lng.b + lng.f)/TravelochainConstants.AVERAGE;

    for (let i = 0; i < result.address_components.length; i++) {
      if (result.address_components[i].types.includes(TravelochainConstants.COUNTRY)) {
        country = result.address_components[i].long_name;
      }
      if (result.address_components[i].types.includes(TravelochainConstants.LOCALITY)) {
        name = result.address_components[i].long_name;
      }
    }

    this.storeCityInformation(lat, lng, name, country);
    return getLatLng(result);
  }

  handleCityChange = (city) => {
    this.setState({city});
  }

  handleCitySelect = (city) => {
    geocodeByAddress(city)
      .then(results => this.cleanUpGeocodeResult(results[0]))
      .catch(error => console.error('Error', error));
  }

  handleCloseClick = () => {}

  handleCityDetailsDialogOpen = () => {
    this.setState({addCityDetailsDialogOpen: true});
  }

  handleCityDetailsDialogClose = () => {
    this.setState({addCityDetailsDialogOpen: false});
  }

  handleCityDialogOpen = () => {
    this.setState({addCityDialogOpen: true});
  }

  handleCityConfirmationDialogClose = () => {
    this.setState({
      showCityConfirmationDialog: false,
    });
  }

  handleCityConfirmationDialogOpen = () => {
    this.setState({
      addCityDialogOpen: false,
      addCityDetailsDialogOpen: false,
      showCityConfirmationDialog: true,
    });
  }

  handleCityDialogClose = (name, lat, lng, country, notes, startDate, endDate) => {
    this.setState({
      addCityDetailsDialogOpen: false,
      addCityDialogOpen: false,
      city: '',
      cities: this.state.cities.concat([{
        name,
        lat,
        lng,
        country,
        notes,
        startDate,
        endDate
      }]),
      currentCityEndDate: '',
      currentCityNote: '',
      currentCityStartDate: '',
      showCityConfirmationDialog: false,
    });
  }

  handleToolbarSelectionChange = (event, index, toolbarViewSelected) => this.setState({toolbarViewSelected})

  saveCurrentCityEndDate = (_, date) => {
    this.setState({
      currentCityEndDate: new Date(
        date.toDateString() + TravelochainConstants.DATE_STRING
      ).toISOString().substring(0, 10),
      unformattedCityEndDate: date.toDateString(),
    });
  }

  saveCurrentCityNote = (_, note) => {
    this.setState({
      currentCityNote: note,
    });
  }

  saveCurrentCityStartDate = (_, date) => {
    this.setState({
      currentCityStartDate: new Date(
        date.toDateString() + TravelochainConstants.DATE_STRING
      ).toISOString().substring(0, 10),
      unformattedCityStartDate: date.toDateString(),
    });
  }

  storeCityInformation = (lat, lng, name, country) => {
    this.setState({
      addCityDetailsDialogOpen: true,
      addCityDialogOpen: false,
      city: name,
      currentCity: {
        name,
        location: {
          lat: lat.toFixed(2),
          lng: lng.toFixed(2),
        },
        country,
      }
    });
  }

  render() {
    return (
      <div className={TravelochainConstants.APP}>
        <header>
          <TToolbar
            addCityDetailsDialogOpen={this.state.addCityDetailsDialogOpen}
            addCityDialogOpen={this.state.addCityDialogOpen}
            city={this.state.city}
            handleCityChange={this.handleCityChange}
            handleCitySelect={this.handleCitySelect}
            handleCloseClick={this.handleCloseClick}
            handleCityDialogOpen={this.handleCityDialogOpen}
            handleCityDialogClose={this.handleCityDialogClose}
            handleCityConfirmationDialogClose={this.handleCityConfirmationDialogClose}
            handleCityConfirmationDialogOpen={this.handleCityConfirmationDialogOpen}
            handleToolbarSelectionChange={this.handleToolbarSelectionChange}
            saveCityVisitedToContract={this.saveCityVisitedToContract}
            saveCurrentCityNote={this.saveCurrentCityNote}
            saveCurrentCityEndDate={this.saveCurrentCityEndDate}
            saveCurrentCityStartDate={this.saveCurrentCityStartDate}
            showCityConfirmationDialog={this.state.showCityConfirmationDialog}
            toolbarViewSelected={this.state.toolbarViewSelected} />
        </header>
        <br/>
        {
          this.state.toolbarViewSelected === TravelochainConstants.TOOLBAR_MAP_VIEW
          ? <TMapContainer className={TravelochainConstants.MAP} cities={this.state.cities} />
          : <div> {TravelochainConstants.AVAILABLE_SOON} </div>
        }
      </div>
    );
  }
}

export default App;
