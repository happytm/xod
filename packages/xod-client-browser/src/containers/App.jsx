import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EventListener from 'react-event-listener';
import { HotKeys } from 'react-hotkeys';

import * as XP from 'xod-project';
import client from 'xod-client';

import PopupInstallApp from '../components/PopupInstallApp';

const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

class App extends client.App {
  constructor(props) {
    super(props);

    this.state = {
      size: client.getViewableSize(DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT),
      popupInstallApp: false,
      popupUploadProject: false,
      popupCreateProject: false,
      workspace: '',
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onShowCodeEspruino = this.onShowCodeEspruino.bind(this);
    this.onShowCodeNodejs = this.onShowCodeNodejs.bind(this);
    this.onShowCodeArduino = this.onShowCodeArduino.bind(this);
    this.onImportChange = this.onImportChange.bind(this);
    this.onImport = this.onImport.bind(this);
    this.onExport = this.onExport.bind(this);
    this.onSelectNodeType = this.onSelectNodeType.bind(this);
    this.onAddNodeClick = this.onAddNodeClick.bind(this);
    this.onCloseApp = this.onCloseApp.bind(this);
    this.onCreateProject = this.onCreateProject.bind(this);

    this.hideInstallAppPopup = this.hideInstallAppPopup.bind(this);
    this.showPopupCreateProject = this.showPopupCreateProject.bind(this);
    this.hidePopupCreateProject = this.hidePopupCreateProject.bind(this);

    props.actions.openProject(props.initialProject);
  }

  onResize() {
    this.setState(
      R.set(
        R.lensProp('size'),
        client.getViewableSize(DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT),
        this.state
      )
    );
  }

  onCreateProject(projectName) {
    this.props.actions.createProject(projectName);
    this.hidePopupCreateProject();
  }

  onUpload() {
    this.showInstallAppPopup();
  }

  onImportChange(event) {
    const file = event.target.files[0];
    const reader = new window.FileReader();

    reader.onload = (e) => {
      this.onImport(e.target.result);
    };

    reader.readAsText(file);
  }

  onSelectNodeType(typeKey) {
    this.props.actions.setSelectedNodeType(typeKey);
  }

  onAddNodeClick() {
    this.props.actions.setMode(client.EDITOR_MODE.CREATING_NODE);
  }

  onKeyDown(event) {  // eslint-disable-line class-methods-use-this
    const keyCode = event.keyCode || event.which;

    if (!client.isInputTarget(event) && keyCode === client.KEYCODE.BACKSPACE) {
      event.preventDefault();
    }

    return false;
  }

  onCloseApp(event) { // eslint-disable-line class-methods-use-this
    let message = true;

    if (this.props.hasChanges) {
      message = 'You have not saved changes in your project. Are you sure want to close app?';
      if (event) { event.returnValue = message; } // eslint-disable-line
    }

    return message;
  }

  getMenuBarItems() {
    const {
      items,
      onClick,
      submenu,
    } = client.menu;

    const importProject = {
      key: 'Import_Project',
      children: (
        <label
          key="import"
          className="load-button"
          htmlFor="importButton"
        >
          <input
            type="file"
            accept=".xodball"
            onChange={this.onImportChange}
            id="importButton"
          />
          <span>
            Import project
          </span>
        </label>
      ),
    };

    return [
      submenu(
        items.file,
        [
          onClick(items.newProject, this.showPopupCreateProject),
          onClick(items.renameProject, this.props.actions.requestRenameProject),
          items.separator,
          importProject,
          onClick(items.exportProject, this.onExport),
          items.separator,
          onClick(items.newPatch, this.props.actions.createPatch),
        ]
      ),
      submenu(
        items.edit,
        [
          onClick(items.undo, this.props.actions.undoCurrentPatch),
          onClick(items.redo, this.props.actions.redoCurrentPatch),
          items.separator,
          onClick(items.projectPreferences, this.props.actions.showProjectPreferences),
        ]
      ),
      submenu(
        items.deploy,
        [
          onClick(items.showCodeForArduino, this.onShowCodeArduino),
          onClick(items.showCodeForNodeJS, this.onShowCodeNodejs),
          items.separator,
          onClick(items.uploadToArduino, this.onUpload),
        ]
      ),
    ];
  }

  showInstallAppPopup() {
    this.setState({ popupInstallApp: true });
  }

  hideInstallAppPopup() {
    this.setState({ popupInstallApp: false });
  }

  showUploadProgressPopup() {
    this.setState({ popupUploadProject: true });
  }

  hideUploadProgressPopup() {
    this.setState({ popupUploadProject: false });
  }

  showPopupCreateProject() {
    this.setState({ popupCreateProject: true });
  }

  hidePopupCreateProject() {
    this.setState({ popupCreateProject: false });
  }

  render() {
    const devToolsInstrument = (client.isChromeApp) ? <client.DevTools /> : null;
    return (
      <HotKeys keyMap={client.HOTKEY} id="App">
        <EventListener
          target={window}
          onResize={this.onResize}
          onKeyDown={this.onKeyDown}
          onBeforeUnload={this.onCloseApp}
        />
        <client.Toolbar
          menuBarItems={this.getMenuBarItems()}
        />
        <client.Editor size={this.state.size} />
        <client.SnackBar />
        {devToolsInstrument}
        <PopupInstallApp
          isVisible={this.state.popupInstallApp}
          onClose={this.hideInstallAppPopup}
        />
        {this.renderPopupShowCode()}
        {this.renderPopupProjectPreferences()}
        {this.renderPopupCreateNewProject()}
      </HotKeys>
    );
  }
}

App.propTypes = R.merge(client.App.propTypes, {
  hasChanges: PropTypes.bool,
  project: client.sanctuaryPropType(XP.Project),
  actions: PropTypes.object,
  initialProject: PropTypes.object.isRequired,
  popups: PropTypes.objectOf(PropTypes.bool),
  popupsData: PropTypes.objectOf(PropTypes.object),
});

const mapStateToProps = R.applySpec({
  hasChanges: client.projectHasChanges,
  project: client.getProject,
  currentPatchPath: client.getCurrentPatchPath,
  popups: {
    showCode: client.getPopupVisibility(client.POPUP_ID.SHOWING_CODE),
    projectPreferences: client.getPopupVisibility(client.POPUP_ID.EDITING_PROJECT_PREFERENCES),
  },
  popupsData: {
    showCode: client.getPopupData(client.POPUP_ID.SHOWING_CODE),
  },
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    R.merge(client.App.actions, {
      // Put custom actions for xod-client-browser here
    }), dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
