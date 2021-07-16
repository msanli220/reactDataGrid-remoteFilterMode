import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { useHistory } from 'react-router-dom';

// components
import { DataGrid } from './components/DataGrid';
import { Chip, Divider, Paper } from '@material-ui/core';
import { Add, Check, Close } from '@material-ui/icons';
import {BMDialog} from './components/BMDialog'
// style
import { makeStyles } from '@material-ui/core/styles';
import theme from './styles'

// action
import StringFilter from '@inovua/reactdatagrid-community/StringFilter';
import Lodash from 'lodash';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import BoolFilter from '@inovua/reactdatagrid-community/BoolFilter';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';


// static
const useStyles = makeStyles(theme);
export default function App (props)  {

    console.log("App.rendered: ", props);

    const classes = useStyles();
    const [ filter, setFilter ] = useState({ limit: 10, offset: 0, order: "CreatedDateTime asc", filter: [] });
    const [ dialogError, setDialogError ] = useState({ isOpen: false, message: "" });

    const columns = [
        { name: 'Name', header: 'Adı',defaultFlex: 1,type: 'BMString', filterEditor: StringFilter, headerAlign: 'center', textAlign: "center" , draggable:false},
        { name: 'Surname', header:'Soyadı', defaultFlex: 1, type: 'BMString', filterEditor: StringFilter, headerAlign: 'center', textAlign: "center" , draggable:false},
        { name: 'CreatedDateTime', header: 'Oluşturulma Tarihi',  minWidth: 100, maxWidth: 150, type: 'BMDate', filterEditor: DateFilter, headerAlign: 'center', textAlign: "center" , draggable:false},
        {
            name: 'Roles', header: 'Grup', filterEditor: StringFilter, minWidth: 100, maxWidth: 150, type: 'BMString', headerAlign: 'center', textAlign: "center",
            render: (params) => { return params.data.Roles.map(item => item.Name).join(", "); }, draggable:false
        },
        { name: 'IsActive', header: 'Durum',minWidth: 100, maxWidth: 150,type: 'boolean', filterEditor: SelectFilter, headerAlign: 'center', textAlign: "center" , draggable:false},
    ];

    const userList=[
      {
          "Id": 3,
          "CreatedDateTime": "2021-07-13T08:58:14.338Z",
          "Name": "TEST1",
          "Surname": "Kullanıcı2",
          "Barcode": "00000002",
          "IsActive": true,
          "Roles": [
              {
                  "Name": "Manager",
                  "UserRoles": {
                      "Id": 3,
                      "CreatedUserId": 1,
                      "CreatedDateTime": "2021-07-13T08:58:14.338Z",
                      "UserId": 3,
                      "RoleId": 3
                  }
              }
          ]
      },
      {
          "Id": 2,
          "CreatedDateTime": "2021-07-13T08:58:14.338Z",
          "Name": "TEST2",
          "Surname": "Kullanıcı1",
          "Barcode": "00000001",
          "IsActive": true,
          "Roles": [
              {
                  "Name": "Manager",
                  "UserRoles": {
                      "Id": 2,
                      "CreatedUserId": 1,
                      "CreatedDateTime": "2021-07-13T08:58:14.338Z",
                      "UserId": 2,
                      "RoleId": 2
                  }
              }
          ]
      },
      {
          "Id": 1,
          "CreatedDateTime": "2021-07-13T08:58:14.338Z",
          "Name": "TEST3",
          "Surname": "Yonetici",
          "Barcode": "00000000",
          "IsActive": true,
          "Roles": [
              {
                  "Name": "Manager",
                  "UserRoles": {
                      "Id": 1,
                      "CreatedUserId": 1,
                      "CreatedDateTime": "2021-07-13T08:58:14.338Z",
                      "UserId": 1,
                      "RoleId": 1
                  }
              }
          ]
      }
  ];

    const defaultOrder = { name: 'CreatedDateTime', dir: 1 }

 

    return(
       
            <Paper className={classes.pageContent} elevation={4}>
                <DataGrid
                    columns={columns}
                    filterParams={value => { setFilter(prevProps => ({...prevProps, ...value})) }}

                    dataSource = {userList}
                 

                    defaultLimit={filter.limit}
                    defaultOffset={filter.offset}
                    defaultOrder={defaultOrder}
                    disableId={true}
              

             
                />
                <BMDialog
                    open={dialogError.isOpen}
                    title={"Sistem Mesajı"}
                    message={dialogError.message}
                    onClose={() => { setDialogError({ isOpen: false, message: "" }) }}
                    onActionResult={() => {
                        setDialogError({ isOpen: false, message: "" })
                        props.doClean();
                    }}
                />
            </Paper>
   
    );
}


