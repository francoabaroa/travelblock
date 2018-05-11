import PlacesAutocomplete from 'react-places-autocomplete'
import React, { Component } from 'react'

import TravelblockConstants from '../constants/TravelblockConstants.js'
import '../styles/App.css';
import { classnames } from '../utils/utils'

import DatePicker from 'material-ui/DatePicker';
import Dialog from 'material-ui/Dialog'
import DropDownMenu from 'material-ui/DropDownMenu'
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'

class TToolbar extends Component {
  constructor(props) {
    super(props);
  }

  getCityDialog = () => {
    const dialogActions = [
      <FlatButton
        label={TravelblockConstants.CANCEL}
        secondary={true}
        keyboardFocused={true}
        onClick={this.props.handleCityDialogClose}
      />,
    ];

    return (
      <Dialog
        title={TravelblockConstants.ADD_A_CITY}
        actions={dialogActions}
        modal={false}
        open={this.props.addCityDialogOpen}
        onRequestClose={this.props.handleCityDialogClose}>
      <PlacesAutocomplete
        value={this.props.city}
        onChange={this.props.handleCityChange}
        onSelect={this.props.handleCitySelect}
        searchOptions={TravelblockConstants.SEARCH_OPTIONS}
      >
      {({ getInputProps, suggestions, getSuggestionItemProps }) => {
      return (
        <div className="Search__search-bar-container">
          <div className="Search__search-input-container">
            <input
              {...getInputProps({
                placeholder: TravelblockConstants.SEARCH,
                className: 'Search__search-input',
              })}
            />
            {this.props.city.length > 0 && (
              <button
                className="Search__clear-button"
                onClick={this.props.handleCloseClick}>
                {TravelblockConstants.X}
              </button>
            )}
          </div>
          {suggestions.length > 0 && (
            <div className="Search__autocomplete-container">
              {suggestions.map(suggestion => {
                const className = classnames('Search__suggestion-item', {
                  'Search__suggestion-item--active': suggestion.active,
                });
                return (
                  /* eslint-disable react/jsx-key */
                  <div
                    {...getSuggestionItemProps(suggestion, { className })}>
                    <strong>
                      {suggestion.formattedSuggestion.mainText}
                    </strong>{TravelblockConstants.STRING_SPACE}
                    <small>
                      {suggestion.formattedSuggestion.secondaryText}
                    </small>
                  </div>
                );
                /* eslint-enable react/jsx-key */
              })}
            </div>
          )}
        </div>
      );
    }}
      </PlacesAutocomplete>
      </Dialog>
    );
  }

  getCityDetailsDialog = () => {
    let dialogActions = [
      <FlatButton
        label={TravelblockConstants.CANCEL}
        secondary={true}
        keyboardFocused={true}
        onClick={this.props.handleCityDialogClose}
      />,
      <FlatButton
        label={TravelblockConstants.SAVE}
        primary={true}
        keyboardFocused={true}
        onClick={this.props.handleCityConfirmationDialogOpen}
      />,
    ];

    return (
      <Dialog
        title={this.props.city + TravelblockConstants.TRIP_INFORMATION}
        actions={dialogActions}
        modal={false}
        open={this.props.addCityDetailsDialogOpen}
        onRequestClose={this.props.handleCityDialogClose}>
        <DatePicker
          autoOk={true}
          hintText={TravelblockConstants.START_DATE}
          mode={TravelblockConstants.LANDSCAPE}
          onChange={this.props.saveCurrentCityStartDate} />
        <DatePicker
          autoOk={true}
          hintText={TravelblockConstants.END_DATE}
          mode={TravelblockConstants.LANDSCAPE}
          onChange={this.props.saveCurrentCityEndDate}/>
        <TextField
          onChange={this.props.saveCurrentCityNote}
          hintText={TravelblockConstants.NOTES_HINT_TEXT}
          floatingLabelText={TravelblockConstants.NOTES_LABEL_TEXT + this.props.city}
          multiLine={true}
          rows={2} />
        <br />
      </Dialog>
    );
  }

  getCitySaveConfirmationDialog = () => {
    let dialogActions = [
      <FlatButton
        label={TravelblockConstants.CANCEL}
        secondary={true}
        keyboardFocused={true}
        onClick={this.props.handleCityDialogClose}
      />,
      <FlatButton
        label={TravelblockConstants.SAVE}
        primary={true}
        keyboardFocused={true}
        onClick={this.props.saveCityVisitedToContract}
      />,
    ];

    return (
      <Dialog
        title={this.props.city + TravelblockConstants.TRIP}
        actions={dialogActions}
        modal={false}
        open={this.props.showCityConfirmationDialog}
        onRequestClose={this.props.handleCityDialogClose}>
        <div> {TravelblockConstants.SAVE_DIALOG_MESSAGE} </div>
        <br />
        <div> {TravelblockConstants.GAS_FEE_MESSAGE} </div>
      </Dialog>
    );
  }

  getDropdownMenu = () => {
    return (
      <DropDownMenu
        value={this.props.toolbarViewSelected}
        onChange={this.props.handleToolbarSelectionChange}>
        <MenuItem
          value={1}
          primaryText={TravelblockConstants.MAP_VIEW} />
        <MenuItem
          value={2}
          primaryText={TravelblockConstants.LIST_VIEW} />
        <MenuItem
          value={3}
          primaryText={TravelblockConstants.STATS_VIEW} />
      </DropDownMenu>
    );
  }

  getToolbarTitle = () => {
    return (
      <ToolbarTitle
        style={{color: TravelblockConstants.WHITE}}
        className={TravelblockConstants.APP_TITLE}
        text={TravelblockConstants.NAME}
      />
    );
  }

  render() {
    let dialog =
      this.props.addCityDialogOpen ?
      this.getCityDialog() :
      this.props.addCityDetailsDialogOpen ?
      this.getCityDetailsDialog() :
      this.props.showCityConfirmationDialog ?
      this.getCitySaveConfirmationDialog() : null;

    return (
      <Toolbar>
        <ToolbarGroup firstChild={true}>
          {this.getToolbarTitle()}
        </ToolbarGroup>
        <ToolbarGroup>
          {this.getDropdownMenu()}
          <ToolbarSeparator />
          <div>
            <RaisedButton
              label={TravelblockConstants.ADD_A_CITY}
              onClick={this.props.handleCityDialogOpen} />
              {dialog}
          </div>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default TToolbar;

