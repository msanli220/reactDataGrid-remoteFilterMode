import React, { useCallback, useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { Add, Print } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter'
import ActionTypeEnum from '../components/ActionTypeEnum';
import { BMDialog } from '../components/BMDialog';
import {BMLoadingButton} from '../components/BMLoadingButton'
import Lodash from 'lodash';
import PaginationToolbar from '@inovua/reactdatagrid-community/packages/PaginationToolbar'
import XLSX from 'xlsx';

import Moment from 'moment'
// Constants
const filterTypes = Object.assign({}, ReactDataGrid.defaultProps.filterTypes, {
    BMString: {
        name: 'BMString',
        operators: [ { name: 'substring' }, { name: "eq" } ]
    },
    BMDate:{
        name: 'BMDate',
        operators: [ { name: "eq" } ,{ name: "gt" } ,{ name: "lt" }  ]
    },
    BMNumber:{
        name: 'BMNumber',
        operators: [ { name: "eq" } ,{ name: "gt" } ,{ name: "lt" }]
    }
});



/**
 *
 * @param props { Object }
 * @param props.path { String }
 * @param props.label { String }
 * @param props.dataSource { Array<Object>> }
 * @param props.columns { Array<Object> }
 * @param props.operation { Object }
 * @param props.operation.hasEdit { Boolean }
 * @param props.operation.hasExport { Boolean }
 * @param props.operation.hasDetails { Boolean }
 * @param props.operation.hasDelete { Boolean }
 * @param props.deleteOnClick { Function }
 * @param props.isLoading { Boolean }
 * @param props.disableId { Boolean }
 * @param props.path { String }
 * @param props.addOnClick { Function }
 * @param props.filterParams { Function }
 * @param props.defaultLimit { Number }
 * @param props.defaultSortInfo { Object }
 * @param props.pagination { Boolean }
 * @param props.disableAddNewButton { Boolean }
 * @param props.height { Number }
 * @returns {JSX.Element}
 * @constructor
 */
 export const DataGrid = (props) => {
    const history = useHistory();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [processedLine, setProcessedLine] = useState({});

  // useEffect(
  //     ()=>{
  //         let strMenu= document.getElementsByClassName("inovua-react-toolkit-menu__row");
  //         let strSeperator=document.getElementsByClassName("inovua-react-toolkit-menu__menu-separator")
  //         console.log("STR",strMenu);
  //         if(strMenu.length>0){
  //             strMenu[strMenu.length-1].parentNode.removeChild(strMenu[strMenu.length-1]);
  //             strMenu[strMenu.length-1].parentNode.removeChild(strMenu[strMenu.length-1]);
  //             strMenu[strMenu.length-1].parentNode.removeChild(strMenu[strMenu.length-1]);
  //             strMenu[strMenu.length-1].parentNode.removeChild(strMenu[strMenu.length-1]);
  //             strSeperator[strSeperator.length-1].parentNode.removeChild(strSeperator[strSeperator.length-1]);
  //             strSeperator[strSeperator.length-1].parentNode.removeChild(strSeperator[strSeperator.length-1]);
  //         }
  //     },[]
  // );

    useEffect (
        () => {
        let pagePerText=Lodash.get(document.getElementsByClassName("inovua-react-pagination-toolbar__per-page-text"),'[0].innerHTML',null);
        if(pagePerText!==null){
            document.getElementsByClassName("inovua-react-pagination-toolbar__per-page-text")[0].innerHTML="Sayfa Başına Sonuç";
        }

        let page=Lodash.get(document.getElementsByClassName("inovua-react-pagination-toolbar__page-text"),'[0].innerHTML',null);
        if(page!==null){
            document.getElementsByClassName("inovua-react-pagination-toolbar__page-text")[0].innerHTML="Sayfa";
        }

        let showing=Lodash.get(document.getElementsByClassName("inovua-react-pagination-toolbar__region"),'[1].innerHTML',null);
        if(showing!==null){
            let str= document.getElementsByClassName("inovua-react-pagination-toolbar__region")[1].innerHTML.split(" ");
            str[0]="Gösteriliyor";
            str[6]="de";
            document.getElementsByClassName("inovua-react-pagination-toolbar__region")[1].innerHTML=str.join(" ")
        }

            Moment.locale('tr');
        },
        [ props.isLoading ]
    );

    // operation buttons
    function editActionOnClick (event, rowData) {
        if ( props.editOnClick ) {
            props.editOnClick(rowData);
        } else {
            history.push({ pathname: `${props.path}/edit/${rowData.Id}`, state: { actionType: ActionTypeEnum.EDIT, referrer: props.path } });
        }
    }
    function detailsActionOnClick (event, rowData) {
        history.push({ pathname: `${props.path}/details/${rowData.Id}`, state: { actionType: ActionTypeEnum.DETAILS, referrer: props.path } });
    }
    function deleteActionOnClick (event, rowData) {
        setDeleteDialogOpen(true);
        setProcessedLine(rowData);
    }
    function deleteActionResult (actionResult)  {
        if ( actionResult ) {
            props.deleteOnClick(processedLine);
        }

        setDeleteDialogOpen(false);
        setProcessedLine({});
    }

    // columns
    function renderOperationButtonsCell(params) {
        const actionButtons = [];
        const rowData = params.data;

        if(props.operation.hasEdit){
            actionButtons.push(
                <Button color="primary" size={'small'} variant={'outlined'} onClick={(event) => { editActionOnClick(null, rowData) }}>Düzenle</Button>
            );
        }
        if(props.operation.hasExport){
            actionButtons.push(
                <BMLoadingButton
                    label={'Rapor İndir'}
                    icon={<Print />}
                    onClick={(e) => {
                        if ( props.addOnClick ) {
                            props.addOnClick(e);
                        } else {
                            history.push({ pathname: `${props.path}/export`, state: { actionType: ActionTypeEnum.EXPORT, referrer: props.path } });
                        }
                    }}
                />
            );
        }
        if(props.operation.hasDelete){
            actionButtons.push(
                <React.Fragment>
                    <Button color="secondary" size={"small"} variant={'outlined'} onClick={(event)=>{ deleteActionOnClick(null, rowData) }}
                            style={ actionButtons.length > 0 ? {marginLeft: 10} : null}>Sil</Button>
                    <BMDialog
                        open={deleteDialogOpen}
                        title={"İşlem Onayı"}
                        message={"Silmek istediğinize emin misiniz?"}
                        onClose={() => { setDeleteDialogOpen(false); }}
                        onActionResult={deleteActionResult}
                    />
                </React.Fragment>
            );
        }
        if(props.operation.hasDetails){
            actionButtons.push(
                <Button style={ actionButtons.length > 0 ? {marginLeft: 10} : null} color="primary" size={'small'} variant={'outlined'} onClick={(event) => { detailsActionOnClick(null, rowData) }}>Detaylar</Button>
            );
        }
        return <React.Fragment>{actionButtons}</React.Fragment>;
    }


    function injectFormatters () {
        return props.columns?.map ( item => {
            if ( item.name === "IsActive" ) {
                return { ...item, filterEditorProps: IsActiveFilterEditorProps, render: IsActiveFormatter };
            }
            else if ( item.type === "BMDate" ) {
                return { ...item, render: ({ value }) => { return value; } };
            }
            else {
                return item;
            }
        });
    }
    function calculateOperationColSize () {
        let colSize = 0;

        if ( props.operation?.hasEdit ) colSize += 100;
        if ( props.operation?.hasDelete ) colSize += 75;
        if ( props.operation?.hasDetails ) colSize +=100;
        if( props.operation?.hasExport)    colSize +=75;
        return colSize;
    }

    const buildIdColumn = () => {
        return props.disableId ?
            [] :
            [ { name: 'Id', header: 'Id', width: 100, type: 'number', filterEditor: NumberFilter, headerAlign: 'center', textAlign: "center" } ];
    }
    const buildOperationColumn = () => {
        const colSize = calculateOperationColSize();
        if ( (props.operation?.hasEdit || props.operation?.hasDelete || props.operation?.hasDetails || props.operation?.hasExport) && colSize>0 ) {
            return [
                {
                    name: "",
                    header: 'İşlemler',
                    width: colSize,
                    headerAlign: 'center',
                    textAlign: "end",
                    render: renderOperationButtonsCell,
                    sortable: false,
                }
            ]
        }
        return [];
    };
    function buildColumns() {
        return [
            ...buildIdColumn(),
            ...injectFormatters(),
            ...buildOperationColumn(),
        ]
    }

    // filters
    function selectOperator(type) {
        if ( type === "boolean" || type==="BMNumber" || type==="BMDate") return "eq"
        else if ( type === "BMString" ) return "substring"
    }
    function generateFilters() {
        if ( props.enableFiltering === false ) return [];

        const filters = [
            { name: 'Id', operator: 'eq', type: 'number' },
        ];

        for ( let item of props.columns ) {
            const isFilterEditorExists = item.filterEditor !== undefined;
            if ( isFilterEditorExists ) filters.push({name: item.name, operator: selectOperator(item.type), type: item.type})
        }

        return filters;
    }

    // column customization
        // formatters
    const IsActiveFormatter = ({ value }) => {
        if ( value ) return <React.Fragment><Button variant={'outlined'} size={'small'} style={{ color: "green", borderColor: "green" }} >AKTİF</Button></React.Fragment>
        else return <React.Fragment><Button variant={'outlined'} size={'small'} color={'secondary'}>PASİF</Button></React.Fragment>
    };
    // const dateTimeFormatter = ({ value }) => {
    //     try {
    //         const _date = new Date(value);
    //         return _date.toJSON().slice(0,10).split('-').reverse().join('/')
    //     } catch (e) {}
    //     return null;
    // };
        // filter editors
    const IsActiveFilterEditorProps = {
        placeholder: 'Tümü',
        dataSource: [
            { id: true, label: "Aktif" },
            { id: false, label: "Pasif" }
        ]
    }

    // pagination
    const renderPaginationToolbar = useCallback((paginationProps) => {
        return <React.Fragment>
            <div style={{ height: 89 }}>
        <PaginationToolbar
            bordered={true}
            {...paginationProps}
            totalCount={props.totalCount||0}
            skip={props.defaultOffset}
        />
        </div>
        </React.Fragment>
    }, [props])

    // actions
    function onFilterValueChange(value) {
        const filters = value.map(item => {
            if ( !Lodash.isEmpty(item?.value?.toString() ) ) {
                let value = item.value.toLocaleLowerCase("tr-TR");
                if ( item.type === "BMDate" ) {
                    value = Moment(item.value).format("YYYY-MM-DDTHH:mm:ss");
                }
                return `${item.name} ${item.operator} ${value}`
            }
        });
        if ( props.filterParams ) props.filterParams({filter: Lodash.compact(filters), offset: 0});
    }

    function onOrderChange(value) {
        if ( props.filterParams && !Lodash.isEmpty(value?.name) ) {
            props.filterParams({order: `${value.name} ${value.dir === 1 ? 'asc' : 'desc'}`})
        } else {
            props.filterParams({order: ""});
        }
    }

    function onLimitChange(value) {
        if ( props.filterParams && props.defaultLimit !== value ) {
            props.filterParams({ limit: value });
        }
    }

    function onSkipChange(value) {
        if ( value > 0 && props.filterParams && props.defaultOffset !== value ) {
            props.filterParams({ offset: value });
        }
    }

    // //export excel report TODO
    // function exportReport(e){
    //     e.preventDefault();
    //     let ws_name = "MySheet";
    //     if(!Lodash.isEmpty(props.list)){
    //         let ws = XLSX.utils.json_to_sheet(props.list);
    //         console.log(ws)
    //         let wb = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(wb, ws, ws_name);
    //         XLSX.writeFile(wb, 'out.xlsx');
    //     }
    // }

    return (
        <React.Fragment>
            {
                props.label ?
                    <Typography variant="subtitle1" gutterBottom>{props.label}</Typography> : null
            }
            <Grid container>
                {
                    props.disableAddNewButton ?
                        null :
                        <Grid item xs={12} style={{textAlign: "right", marginBottom: 20}}>
                            <BMLoadingButton
                                label={'Yeni Ekle'}
                                icon={<Add />}
                                onClick={(e) => {
                                    if ( props.addOnClick ) {
                                        props.addOnClick(e);
                                    } else {
                                        history.push({ pathname: `${props.path}/add`, state: { actionType: ActionTypeEnum.ADD, referrer: props.path } });
                                    }
                                }}
                            />

                        </Grid>
                }
                <Grid item xs={12}>
                    <ReactDataGrid
                        idProperty="Id"
                        columns={buildColumns()}
                        dataSource={props.dataSource||[]}

                        style={{minHeight: `${props.height || 500}px`}}
                    
                        renderPaginationToolbar={renderPaginationToolbar}
                        rowReorderColumn
                        pagination={props.pagination !== false ? 'remote' : false}
                        showColumnMenuTool={false}
                        showZebraRows={true}

                        // filtering
                        enableFiltering = {props.enableFiltering !== false}
                        remoteFilter = {true}
                        filterTypes = {filterTypes}
                        defaultFilterValue = {generateFilters()}
                        onFilterValueChange = {onFilterValueChange}

                        // limit
                        defaultLimit = {props.defaultLimit}
                        onLimitChange = {onLimitChange}

                        // offset
                        onSkipChange = {onSkipChange}

                        // order
                        defaultSortInfo = {props.defaultOrder}
                        onSortInfoChange={onOrderChange}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

