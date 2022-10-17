//#region Imports

import React, { Component } from 'react';
import {
  Grid,
} from '@mui/material';
import {
  Block as BlockIcon,
  Info as InfoIcon,
  ManageAccounts as ManageAccountsIcon,
  PowerSettingsNew as ShutdownIcon,
  RestartAlt as RestartIcon,
} from '@mui/icons-material';
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridSelectionModel,
  GridToolbar,
  GridValueGetterParams,
} from '@mui/x-data-grid';

import authService from '../components/api-authorization/AuthorizeService'
import { Device } from '../components/Device';
import { SplitButton } from '../components/SplitButton';
import { DeviceModel } from '../types/contracts/DeviceModel';
import { DropdownButtonItem } from '../types/contracts/DropdownButtonProps';

//#endregion

//#region Global Variables

const dropdownItems: DropdownButtonItem[] = [
  {
    key: 'manage',
    text: 'Manage',
    onClick: (device: DeviceModel) => {
      const url = "/#/device/manage/" + device.uuid;
      console.log('url:', url);
      window.location.href = url;
    },
    icon: <ManageAccountsIcon />,
    displayIndex: 0,
    isDivider: false,
  },
  {
    key: 'details',
    text: 'Details',
    onClick: (device: DeviceModel) => { console.log('device details clicked!', device); },
    icon: <InfoIcon />,
    displayIndex: 1,
    isDivider: false,
  },
  {
    key: '',
    text: '',
    onClick: () => {},
    icon: '',
    displayIndex: 2,
    isDivider: true,
  },
  {
    key: 'reboot',
    text: 'Reboot',
    onClick: (device: DeviceModel) => { console.log('device reboot clicked!', device); },
    icon: <RestartIcon />,
    displayIndex: 3,
    isDivider: false,
  },
  {
    key: 'shutdown',
    text: 'Shutdown',
    onClick: (device: DeviceModel) => { console.log('device shutdown clicked!', device); },
    icon: <ShutdownIcon />,
    displayIndex: 4,
    isDivider: false,
  },
  {
    key: 'block',
    text: 'Block',
    onClick: (device: DeviceModel) => { console.log('device block clicked!', device); },
    icon: <BlockIcon />,
    displayIndex: 4,
    isDivider: false,
  }
];
const columns: GridColDef[] = [
  {
    field: 'uuid',
    headerName: 'UUID',
    minWidth: 100,
    sortable: true,
    hideable: false,
    filterable: true,
    flex: 2,
    renderCell: (params: GridRenderCellParams) => {
      //console.log('cell params:', params);
      const now = new Date().getTime() / 1000;
      const isOnline = now - params.row.last_seen >= deviceOnlineThresholdS;
      const status = isOnline ? DeviceOnlineIcon : DeviceOfflineIcon;
      return `${status} ${params.row.uuid}`;
    },
  },
  {
    field: 'instance_name',
    headerName: 'Instance',
    minWidth: 200,
    width: 250,
    //align: 'right',
    sortable: true,
    hideable: true,
    filterable: true,
    flex: 2,
  },
  {
    field: 'account_username',
    headerName: 'Account',
    minWidth: 200,
    width: 250,
    //align: 'right',
    sortable: true,
    hideable: true,
    filterable: true,
    flex: 2,
  },
  {
    field: 'last_seen',
    headerName: 'Last Seen',
    minWidth: 250,
    sortable: true,
    hideable: true,
    filterable: true,
    flex: 2,
    valueGetter: (params: GridValueGetterParams) => {
      const date = new Date(params.value * 1000);
      return date.toLocaleString();
    },
  },
  {
    field: '',
    headerName: 'Action',
    minWidth: 100,
    maxWidth: 150,
    width: 100,
    sortable: false,
    hideable: true,
    filterable: false,
    flex: 2,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <SplitButton device={params.row} items={dropdownItems} />
      );
    },
  }
];
const deviceOnlineThresholdS = 15 * 60; // 15 minutes (900)
const DeviceOnlineIcon = "🟢"; // green dot
const DeviceOfflineIcon = "🔴"; // red dot
let init = true;

//#endregion

export class Devices extends Component {
  static displayName = Devices.name;
  state: any;

  constructor(props: any) {
    super(props);
    this.state = {
      devices: [],
      loading: true,
      page: 0,
      rowsPerPage: 10,
      checkboxSelection: [],
    };
  }

  componentDidMount() {
    this.populateDeviceData();
  }

  renderDevicesTable(devices: DeviceModel[]) {
    const handleChangePage = (page: number, details: GridCallbackDetails) => {
      this.setState({ ['page']: page });
    };

    const handleChangeRowsPerPage = (pageSize: number, details: GridCallbackDetails) => {
      this.setState({
        ['rowsPerPage']: pageSize,
        ['page']: 0,
      });
    };

    const handleChangeSelectionModel = (selectionModel: GridSelectionModel, details: GridCallbackDetails) => {
      this.setState({
        ['checkboxSelection']: selectionModel,
      });
      //console.log('checkboxSelection:', selectionModel);
    };

    return (
      <div style={{ height: '700px', width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flexGrow: 1, height: '100%' }}>
            <DataGrid
              checkboxSelection={init ? true : this.state.checkboxSelection ?? []}
              onSelectionModelChange={handleChangeSelectionModel}
              disableSelectionOnClick
              //autoHeight
              rows={devices}
              rowCount={devices.length}
              columns={columns}
              loading={this.state.loading}
              page={this.state.page}
              pageSize={this.state.rowsPerPage}
              //rowsPerPageOptions={[10, 25, 100, 250, 500, { value: -1, label: 'All' }]}
              rowsPerPageOptions={[10, 25, 100]}
              onPageChange={handleChangePage}
              onPageSizeChange={handleChangeRowsPerPage}
              pagination
              components={{ Toolbar: GridToolbar }}
              //getDetailPanelContent={({ row }) => (<div>Row Id: {row.id}</div>)}
            />
          </div>
        </div>
        <br />
        {init = false}
        <Grid container spacing={2}>
          {devices.map((device: any) =>
            <Grid item xs={2} key={device.uuid}>
              {<Device {...device} />}
            </Grid>
          )}
        </Grid>
      </div>
    );
  }

  render() {
    const contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderDevicesTable(this.state.devices);

    return (
      <div>
        <h1 id="tableLabel">Devices</h1>
        <p>All known scanning devices.</p>
        {contents}
      </div>
    );
  }

  async populateDeviceData() {
    const token = await authService.getAccessToken();
    const response = await fetch('api/v1/device', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    const devices = data.map((device: any) => { return { ...device, id: device.uuid }; });
    this.setState({ devices, loading: false });
  }
}

/*
function DeviceTableRow(props: { row: any, columns: readonly GridColDef[] }) { //DeviceModel
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {columns.map((column: GridColDef) => {
          const value = row[column.field];
          console.log('value:', value);
          return (
            column.field === 'uuid'
            ? <TableCell key={column.field} align={column.align}>
                {value}
              </TableCell>
            : <TableCell component="th" scope="row" key={column.field} align={column.align}>
                {value}
              </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {//row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))//}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
 */
