import { DeviceModel } from './DeviceModel';

export interface DropdownButtonProps {
  device: DeviceModel;
  items: DropdownButtonItem[];
};

export interface DropdownButtonItem {
  key: string;
  text: string;
  onClick: any;
  icon: any;
  displayIndex: number;
  isDivider: boolean;
};