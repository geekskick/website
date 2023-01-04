import { Typography, Box, ListItem, List } from '@mui/material';
import React from 'react';
import ErrorBoundary from './../../components/error_boundary';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';

const TODOS = [
    "Make the app title all the way to the left when in large screen mode",
    "Implement Gen VI onwards pokemon catch calculators",
    "Make the Nathan Eats game",
    "Make the notification pop ups different colors based on the apps themselves",
    "Refactor all the code as I learn more",
    "Link this into the github API so that I can pull these issues from github itself",
    "Link this into the github API so that the content of pages can be generated from files - like a blog system"
];

export default function About(props) {
    console.log("About::props = ", props);
    return (<ErrorBoundary onError={props.error}>
        <Box>
            <Typography>This website has been made mostly as a way of learning about React and different technologies which I'm not too familiar with. If there's an issue use the 'Report a Bug' option in the menu to raise a bug on github against this site.</Typography>
            <Divider sx={{ margin: 5 }} />
            <List subheader="TODOS">{
                TODOS.map(todo => {
                    return (<ListItem>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={false}
                                disabled={true}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                        <ListItemText primary={`${todo}`} />
                    </ListItem>)
                })
            }
            </List>
            <Divider sx={{ margin: 5 }} />
            <Typography>This is the version of the app with git SHA {process.env.REACT_APP_VERSION}</Typography>
        </Box>
    </ErrorBoundary>);
}