import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';

/**
 *
 * @param props { Object }
 * @param props.open { Boolean }
 * @param props.onClose { Function }
 * @param props.title { String }
 * @param props.message { String }
 * @param props.onActionResult { Function }
 * @param props.children { any }
 * @param props.maxWidth { string }
 * @param props.actionButton { Function }
 * @returns {JSX.Element}
 * @constructor
 */
 export const BMDialog = (props) => {

    function acceptOnClick(e) {
        props.onActionResult(true);
    }

    function cancelOnClick(e) {
        props.onActionResult(false);
    }



    return (
        <Dialog
            open={props.open}
            keepMounted
            onClose={props.onClose}
            fullWidth
            maxWidth={props.maxWidth ?
                props.maxWidth() :'sm'}
        >
            <DialogTitle>{props.title}</DialogTitle>

            <DialogContent>
                { props.message ? <DialogContentText> {props.message} </DialogContentText> : props.children }
            </DialogContent>

            <DialogActions>
                {
                    props.actionButton ?
                        props.actionButton() :
                        <React.Fragment>
                            <Button onClick={cancelOnClick} color="secondary" variant={"contained"} >IPTAL</Button>
                            <Button onClick={acceptOnClick} color="primary" variant={'contained'}>TAMAM</Button>
                        </React.Fragment>
                }
            </DialogActions>
        </Dialog>
    );
}
