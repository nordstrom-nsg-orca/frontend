import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

class Dashboard extends React.Component {
  render () {
    return (
      <div>
        <Paper style={{ padding: '16px' }}>
          <Typography variant='h4' style={{textAlign: 'center'}}>WELCOME TO ORCA v2</Typography>
          <Typography style={{marginTop: '30px'}}>
            This is only a temporary Dashboard while the real Dashboard features are in development.
          </Typography>
          <Typography style={{marginTop: '30px'}}>
            This version of Orca allows you to build custom schemas for custom data storage. In order to get started, click the SCHEMAS tab and select EDIT SCHEMAS!
          </Typography>
          <Typography style={{marginTop: '8px'}}>
            The design of Schemas is based off of <a target="_blank" href="https://json-schema.org/" style={{textDecoration:'underline'}}>JSON Schema</a>. The schema's created here are processed into JSON Schema definitions which are used for data validation. An understanding of JSON Schema isn't required to use Orca, though.
          </Typography>
        </Paper>

        <Paper style={{ padding: '16px', marginTop:'8px'}}>
          <Typography variant='h5' style={{marginTop: '8px', textAlign: 'center'}}>
            CREATING A SCHEMA
          </Typography>
          <Typography style={{marginTop: '8px'}}>
            Creating a Schema is similar to creating a SQL Table. A column in SQL is similar to a Property in Orca. Properties in Orca differ in that they allow for properties to contain objects instead of just primitive data types. 
          </Typography>
          <Typography style={{marginTop: '8px'}}>
            When you create a new Schema, two values are first available to edit. The <code>name</code> is self explanatory. This is the same name used to retrieve the data with the ansible plugins.
          </Typography>
          <Typography style={{marginTop: '8px'}}>
            The next value is <code>properties</code> and this is an array of objects. Each property object requires at least three values: <code>name</code>, <code>type</code>, <code>required</code>.
          </Typography>
          <Typography style={{marginTop: '8px'}}>
            The <code>name</code> is the name of the property. The <code>type</code> for each property can be one of these: <code>string</code>, <code>integer</code>, <code>number</code>, <code>booelan</code>, <code>array</code>, <code>object</code>. If you want to use the type <code>array</code>, the field <code>items</code> will be required and it contains the information about what type of data it will be an array of. If you want to use type <code>object</code>, the field <code>properties</code> will be required and it is the exact same definition as the above <code>properties</code>.
          </Typography>
        </Paper>
      </div>
    );
  }
}

export default Dashboard;
