import React from 'react';

import Acl from 'pages/NetworkData/ACL';
import InfobloxGroup from 'pages/Infoblox/Group';
import Server from 'pages/NetworkData/Server';

import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import StorageIcon from '@material-ui/icons/Storage';
import AccessibilityRoundedIcon from '@material-ui/icons/AccessibilityRounded';

const tabs = {
  data: {
    name: 'Network Data',
    pages: {
      acl: {
        name: 'ACLs',
        component: Acl,
        icon: <ViewHeadlineIcon />
      },
      server: {
        name: 'Servers',
        component: Server,
        icon: <StorageIcon />
      }
    }
  },
  infoblox: {
    name: 'Infoblox',
    pages: {
      group: {
        name: 'Group Permission',
        component: InfobloxGroup,
        icon: <AccessibilityRoundedIcon />
      }
    }
  }
};

export default function generateTabs (allowedTabs) {
  if (!allowedTabs) return {};
  for (const key in tabs) {
    const tab = tabs[key];
    let tabAllowed = false;
    for (const pkey in tab.pages) {
      const page = tab.pages[pkey];
      const url = `${key}/${pkey}`;
      if (typeof allowedTabs[url] === 'boolean') {
        page.allowed = true;
        page.write = allowedTabs[url];
      } else if (typeof allowedTabs[`${key}/.*`] === 'boolean') {
        page.allowed = true;
        page.write = allowedTabs[`${key}/.*`];
      } else if (typeof allowedTabs['.*'] === 'boolean') {
        page.allowed = true;
        page.write = allowedTabs['.*'];
      } else
        page.allowed = false;
      tabAllowed = tabAllowed || page.allowed;
    }
    tab.allowed = tabAllowed;
  }
  return tabs;
}
