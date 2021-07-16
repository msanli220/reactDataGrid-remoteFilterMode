import React from 'react';

export default theme => ({
    root: {
        '& > *': {},

        margin: 5
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    title: {
        margin: "auto",
        marginLeft: theme.spacing(3),
        marginTop: 20,
        marginBottom: 20,
        fontFamily: 'Helvetica',
        fontWeight:'medium',
        textTransform: 'none'

    },
    buttonContainer: {
        display: 'flex',
        justifyContent: "flex-end",
        margin: 8,
        textTransform: 'none',
        marginRight:theme.spacing(2)
    }
});

