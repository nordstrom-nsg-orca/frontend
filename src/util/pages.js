import React from 'react';

import Acl from 'pages/NetworkData/ACL';
import InfobloxGroup from 'pages/Infoblox/Group';
import Server from 'pages/NetworkData/Server';

import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import StorageIcon from '@material-ui/icons/Storage';
import AccessibilityRoundedIcon from '@material-ui/icons/AccessibilityRounded';

const tabs = [
  {
    name: 'Network Data',
    pages: [
      {
        url: '/acl',
        name: 'ACLs',
        component: Acl,
        icon: <ViewHeadlineIcon />
      },
      {
        url: '/server',
        name: 'Servers',
        component: Server,
        icon: <StorageIcon />
      }
    ]
  },
  {
    name: 'Infoblox',
    pages: [
      {
        url: '/infobloxGroup',
        name: 'Infoblox Group Permission',
        component: InfobloxGroup,
        icon: <AccessibilityRoundedIcon />
      }
    ]
  }
];

export default tabs;