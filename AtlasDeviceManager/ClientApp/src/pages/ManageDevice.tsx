//#region Imports

import React, { Component } from 'react';
import {
  Button,
  ButtonGroup,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from '@mui/material';
import authService from '../components/api-authorization/AuthorizeService'
import { BreadCrumbs } from '../components/BreadCrumbs';
import { Device } from '../components/Device';
import { DeviceModel } from '../types/contracts/DeviceModel';
import { IGlobalProps } from '../types/contracts/IGlobalProps';
import withRouter from '../hooks/WithRouter';

//#endregion

class ManageDevice extends Component<IGlobalProps> {
  static displayName = ManageDevice.name;
  state: any;

  constructor(props: IGlobalProps) {
    super(props);
    this.state = {
      device: null,
      loading: true,
    };
  }

  componentDidMount() {
    if (this.props.params?.uuid) {
      this.populateDeviceData(this.props.params!.uuid);
    }
  }

  renderDeviceDetails(device: DeviceModel) {
    return (
      <Device {...device} />
    );
  }

  render() {
    const breadcrumbs = [{
      text: 'Dashboard',
      color: 'inherit',
      href: '/',
      selected: false,
    }, {
      text: 'Devices',
      color: 'inherit',
      href: '/#/devices',
      selected: false,
    }, {
      text: 'Manage Device ' + this.props.params!.uuid,
      color: 'primary',
      href: '',
      selected: true,
    }];
    const contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderDeviceDetails(this.state.device);

    return (
      <div>
        <h1 id="tableLabel">Manage Device {this.props.params!.uuid}</h1>
        <BreadCrumbs crumbs={breadcrumbs} />
        {contents}
      </div>
    );
  }

  async populateDeviceData(uuid: string) {
    const token = await authService.getAccessToken();
    const response = await fetch('api/v1/device/' + uuid, {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    const device = { ...data, id: data.uuid };
    this.setState({ device, loading: false });
  }
}
export default withRouter(ManageDevice);
