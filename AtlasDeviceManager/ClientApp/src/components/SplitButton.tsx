import React, { Component } from 'react';
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Divider,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import {
  ArrowDropDown as ArrowDropDownIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { DropdownButtonProps, DropdownButtonItem } from '../types/contracts/DropdownButtonProps';

export function SplitButton(props: DropdownButtonProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: DropdownButtonItem,
  ) => {
    setOpen(false);

    item.onClick(props.device);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" size="small">
        <Button onClick={handleToggle}>
          <MenuIcon />&nbsp;<ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        placement="bottom-start"
        //disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {props.items.map((item, index) =>
                    item.isDivider ? <Divider key={item.key} /> :
                    <MenuItem
                      key={item.key}
                      onClick={(event) => handleMenuItemClick(event, item)}
                    >
                      <ListItemIcon>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText>{item.text}</ListItemText>
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};
