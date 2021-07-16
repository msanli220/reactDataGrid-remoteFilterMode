import React from 'react';
import theme from './style';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress, Divider } from '@material-ui/core';


const useStyles=makeStyles(theme);
export const PageLayout = ({ title, children, actionButtons, isLoading }) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.titleContainer}>

                <h3 className={classes.title}>{title}</h3>
                {
                    actionButtons !== null && actionButtons !== undefined ?
                        <div className={classes.buttonContainer}>
                            { actionButtons() }
                        </div> :
                        null
                }

            </div>
            <Divider light  variant="middle" />
            { children }
            <Backdrop style={{zIndex: 999, color: '#fff'}} open={isLoading} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </React.Fragment>
    );
}
