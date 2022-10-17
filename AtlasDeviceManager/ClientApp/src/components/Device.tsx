import React, { Component } from 'react';

export class Device extends Component<any> {
  static displayName = Device.name;
  state: any;

  constructor(props: any) {
    super(props);
    this.state = { selected: false };
  }

  render() {
    const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const selected = this.state.selected ? false : true;
      this.setState({
          selected: selected,
      });
      e.currentTarget.style.color = selected ? "white" : "inherit";
      e.currentTarget.style.backgroundColor = selected ? "dodgerblue" : "inherit";
    };
    const onMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (this.state.selected) {
        return;
      }
      e.currentTarget.style.color = "white";
      e.currentTarget.style.backgroundColor = "grey";
    };
    const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (this.state.selected) {
        return;
      }
      e.currentTarget.style.color = "inherit";
      e.currentTarget.style.backgroundColor = "inherit";
    };

    return (
      <div onMouseDown={onMouseDown}
           onMouseEnter={onMouseEnter}
           onMouseLeave={onMouseLeave}
           style={{ height: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
        {this.props.uuid}<br />
        {/*new Date(this.props.last_seen * 1000).toLocaleString()*/}
      </div>
    );
  }
}