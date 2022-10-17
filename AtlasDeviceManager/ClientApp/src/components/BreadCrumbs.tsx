﻿import React from 'react';
import {
  Breadcrumbs,
  Link,
  Typography,
} from '@mui/material';

export interface BreadCrumbProps {
  crumbs: BreadCrumbItem[];
}

export interface BreadCrumbItem {
  text: string;
  color: string;
  href: string;
  selected: boolean;
}

export function BreadCrumbs(props: BreadCrumbProps) {
  return (
    <div role="presentation" style={{paddingTop: '10px', paddingBottom: '30px'}}>
      <Breadcrumbs aria-label="breadcrumb">
        {props.crumbs.map((crumb: BreadCrumbItem) => {
          return (
            crumb.selected
            ? <Typography key={crumb.text}>{crumb.text}</Typography>
            : <Link
              key={crumb.text}
              underline="hover"
              color={crumb.color}
              href={crumb.href}
            >
              {crumb.text}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};
