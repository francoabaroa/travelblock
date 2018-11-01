import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import React, { Component } from 'react';
import TravelblockCityFactoryContract from '../build/contracts/TravelblockCityFactory.json'
import TMapContainer from './TMapContainer.js';
import TToolbar from './TToolbar.js';
import getWeb3 from '../utils/getWeb3'

import '../styles/App.css';
import TravelblockConstants from '../constants/TravelblockConstants.js'

const contract = require('truffle-contract');
const secp256k1 = require('secp256k1');
const keccak = require('keccak');
const randomBytes = require('randombytes');

const keccak256 = require('js-sha3').keccak256;

const elliptic = require('elliptic');
const _secp256k1 = new (elliptic.ec)('secp256k1');

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
      currentCityFavFood: '',
      currentCityMemories: '',
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
    const randbytes = randomBytes(32);
    // const test = {
    //   address: privateToAddress(randbytes).toString('hex'),
    //   privKey: randbytes.toString('hex')
    // };
    const privkey = new Buffer(
      '3406ac43ead9b0a3ec3c2acd5f1ed54fdc5bd45ca862d329ba0a4841505f762e',
      'hex'
    );
    const pub = secp256k1.publicKeyCreate(privkey, false).slice(1);

    const tmp = (new Buffer(_secp256k1.keyFromPrivate(privkey).getPublic(false, 'hex'), 'hex')).slice(1);
    const tmp2 = (_secp256k1.keyFromPrivate(privkey).getPublic(false, 'hex')).slice(1);
    // const address = keccak256.update(tmp).toString().slice(24);
    // const address2 = keccak256.update(tmp2).toString().slice(24);
    console.log(pub, 'pub', tmp, '-temps-', tmp2);

    console.log('PRIV', privkey, privkey.toString('hex'));
    // 3406ac43ead9b0a3ec3c2acd5f1ed54fdc5bd45ca862d329ba0a4841505f762e
    console.log(
      'hello world',
      randbytes,
      randbytes.toString('hex'),
      'pub',
      pub,
      keccak('keccak256').update(pub).digest().slice(-20).toString('hex'),
      '---- frank ----',
      keccak256.update(pub).toString().slice(24),
    );


    getWeb3
    .then(results => {
      const test1 = results.web3.eth.accounts.privateKeyToAccount('0x' + privkey.toString('hex'));
      console.log('TEST1', test1);
      console.log('WEB3', results.web3);
      // const signa = test1.signTransaction({to:'0xebf44749b4fd57e1285faa66326c060031878357', value:results.web3.utils.toWei("0.005", "ether"), gas: 3000000}).then(signed => {
      //     console.log('SIGNED', signed, '-----', signed.toString('hex'), signed.toString());
      //     var tran = results.web3.eth.sendSignedTransaction(signed.rawTransaction);

      //     tran.on('confirmation', (confirmationNumber, receipt) => {
      //       console.log('confirmation: ' + confirmationNumber);
      //     });

      //     tran.on('transactionHash', hash => {
      //       console.log('hash');
      //       console.log(hash);
      //     });

      //     tran.on('receipt', receipt => {
      //       console.log('reciept');
      //       console.log(receipt);
      //     });

      //     tran.on('error', error => {
      //         console.log(error.toString());
      //     });


      //   });
      // console.log('SIGNA', signa);
      // results.web3.eth.sendTransaction({to:'0xebf44749b4fd57e1285faa66326c060031878357', from:test1, value:results.web3.utils.toWei("0.5", "ether"), gas: 3000000}, (error) => {
      //   console.log('error', error);
      // });
      this.setState({
        web3: results.web3
      })
      // this.instantiateContract();
    })
    .catch((error) => {
      console.log(TravelblockConstants.WEB3_ERROR, error, arguments);
    })
  }

  getExchangeRate() {
    let GET = 'GET';
    let cryptocompareAPI = 'https://min-api.cryptocompare.com/data/price?fsym=';
    let cryptocompareUSD = '&tsyms=USD';
    let cryptocurrency = 'crypto';
    let USD = 'USD';

    let request = new XMLHttpRequest();
    request.open(
      GET,
      cryptocompareAPI + cryptocurrency + cryptocompareUSD,
      false
    );
    request.send(null);
    return JSON.parse(request.responseText)[USD];
  }

  instantiateContract() {
    /*
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    let travelblockCityFactoryInstance;
    const travelblockStorage = contract(TravelblockCityFactoryContract);
    travelblockStorage.setProvider(this.state.web3.currentProvider);
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log('hey franco, accounts here', accounts);
      travelblockStorage.deployed().then((instance) => {
        travelblockCityFactoryInstance = instance;
        return travelblockCityFactoryInstance.getCitiesByOwner(accounts[0]);
      }).then((result) => {
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            // eslint-disable-next-line
            travelblockCityFactoryInstance.cities(result[i].c[0]).then((result) => {
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
                contractInstance: travelblockCityFactoryInstance,
                currentAccount: accounts[0],
              });
            });
          }
        } else {
          return this.setState({
            contractInstance: travelblockCityFactoryInstance,
            currentAccount: accounts[0],
          });
        }
      })
    })
  }

  saveCityVisitedToContract = () => {
    let name = this.state.currentCity.name;
    let lat = this.state.currentCity.location.lat;
    let lng = this.state.currentCity.location.lng;
    let country = this.state.currentCity.country;
    let notes = this.state.currentCityNote;
    // currentCityFavFood
    let startDate = parseInt(this.state.currentCityStartDate.split('-').join(''), 10);
    let endDate = parseInt(this.state.currentCityEndDate.split('-').join(''), 10);
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
    if (result.geometry.hasOwnProperty('bounds')) {
      let lat = result.geometry.bounds.f;
      let lng = result.geometry.bounds.b;
      lat = (lat.b + lat.f)/TravelblockConstants.AVERAGE;
      lng = (lng.b + lng.f)/TravelblockConstants.AVERAGE;

      for (let i = 0; i < result.address_components.length; i++) {
        if (result.address_components[i].types.includes(TravelblockConstants.COUNTRY)) {
          country = result.address_components[i].long_name;
        }
        if (result.address_components[i].types.includes(TravelblockConstants.LOCALITY)) {
          name = result.address_components[i].long_name;
        }
      }

      this.storeCityInformation(lat, lng, name, country);
      return getLatLng(result);
    } else {
      // TODO: show error msg to user
    }
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
      currentCityFavFood: '',
      currentCityMemories: '',
      currentCityStartDate: '',
      showCityConfirmationDialog: false,
    });
  }

  handleToolbarSelectionChange = (event, index, toolbarViewSelected) => this.setState({toolbarViewSelected})

  saveCurrentCityEndDate = (_, date) => {
    this.setState({
      currentCityEndDate: new Date(
        date.toDateString() + TravelblockConstants.DATE_STRING
      ).toISOString().substring(0, 10),
      unformattedCityEndDate: date.toDateString(),
    });
  }

  saveCurrentCityNote = (_, note) => {
    this.setState({
      currentCityNote: note,
    });
  }

  saveCurrentCityFavFood = (_, food) => {
    this.setState({
      currentCityFavFood: food,
    });
  }

  saveCurrentCityMemories = (_, memories) => {
    this.setState({
      currentCityMemories: memories,
    });
  }

  saveCurrentCityStartDate = (_, date) => {
    this.setState({
      currentCityStartDate: new Date(
        date.toDateString() + TravelblockConstants.DATE_STRING
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
    console.log('state', this.state);
    return (
      <div className={TravelblockConstants.APP}>
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
            saveCurrentCityFavFood={this.saveCurrentCityFavFood}
            saveCurrentCityMemories={this.saveCurrentCityMemories}
            saveCurrentCityEndDate={this.saveCurrentCityEndDate}
            saveCurrentCityStartDate={this.saveCurrentCityStartDate}
            showCityConfirmationDialog={this.state.showCityConfirmationDialog}
            toolbarViewSelected={this.state.toolbarViewSelected} />
        </header>
        <br/>
        {
          this.state.toolbarViewSelected === TravelblockConstants.TOOLBAR_MAP_VIEW
          ? <TMapContainer className={TravelblockConstants.MAP} cities={this.state.cities} />
          : <div> {TravelblockConstants.AVAILABLE_SOON} </div>
        }
      </div>
    );
  }
}

export default App;
