import { Typography, Box, ListItem, List } from '@mui/material';
import React from 'react';
import ErrorBoundary from './../../components/error_boundary';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';


export default function About(props) {
    console.log("About::props = ", props);

    const [issues, setIssues] = React.useState([]);

    React.useEffect(() => {
        // TODO: make this fromthe config
        fetch("https://api.github.com/repos/geekskick/website/issues?state=all")
            .then(data => data.text())
            .then(json => {
                const issues = JSON.parse(json);
                console.log("Issues are ", issues);
                setIssues(issues);
            });
    }, []);
    return (<ErrorBoundary onError={props.error}>
        <Box>
            <Typography>This website has been made mostly as a way of learning about React and different technologies which I'm not too familiar with. If there's an issue use the 'Report a Bug' option in the menu to raise a bug on github against this site.</Typography>
            <Divider sx={{ margin: 5 }} />
            <List subheader="Issues">{
                issues.map(todo => {
                    return (<ListItem>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={todo.state !== "open"}
                                disabled={true}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                        <ListItemText primary={`${todo.title}`} />
                    </ListItem>)
                })
            }
            </List>
            <Divider sx={{ margin: 5 }} />
            <Typography>This is the version of the app with git SHA {process.env.REACT_APP_VERSION}</Typography>
        </Box>
    </ErrorBoundary>);
}