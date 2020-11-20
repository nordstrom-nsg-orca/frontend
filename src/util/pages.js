import React from 'react';

// import OrcaDataPage from 'components/OrcaDataPage';
import SchemaDataPage from 'components/SchemaDataPage';

import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import StorageIcon from '@material-ui/icons/Storage';
// import AccessibilityRoundedIcon from '@material-ui/icons/AccessibilityRounded';

import API from 'util/api.js';

const icons = {
  acl: <ViewHeadlineIcon />,
  server: <StorageIcon />
};

export default async function generateTabs (allowedTabs) {
  if (!allowedTabs) return {};
  for (const tab in allowedTabs) {
    if (!allowedTabs[tab].allowed) continue;
    for (const page in allowedTabs[tab].pages) {
      const schemaId = await getSchemaId(page);
      const pageData = allowedTabs[tab].pages[page];
      // pageData.component = props =>
      //   <OrcaDataPage
      //     title={pageData.name}
      //     loadUrl={pageData.loadUrl}
      //     crudUrl={pageData.crudUrl}
      //     parentId={pageData.parentId}
      //     write={pageData.write}
      //   />;
      // pageData.icon = icons[page];
      pageData.component = props =>
        <SchemaDataPage
          title={pageData.name}
          id={schemaId}
          write={pageData.write}
        />;
      pageData.icon = icons[page];
    }
  }
  return allowedTabs;
}

async function getSchemaId (page) {
  const schemas = await API.GET('/schemas');
  for (var i = 0; i < schemas.length; i++) {
    const schema = schemas[i];
    if (schema.name === page)
      return schema.id;
  }
  return null;
}
