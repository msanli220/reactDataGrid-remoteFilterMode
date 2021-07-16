import React from 'react';

export default theme => ({
    root: {
        '& > *': {},
        margin: 8
    },
    pageContent: {
        margin: theme.spacing(3),
        padding: theme.spacing(3),
        borderRadius: '0.5em',
    },
    textField:{
        textTransform: 'none',
    },
    buttons: {
        marginTop:'2%',
        display: 'flex',
        justifyContent: "flex-end",
        textTransform: 'none',
    },

});

