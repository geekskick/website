import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { SidebarContents, SidebarFooter } from './sidebar';
import PropTypes from 'prop-types';

ResponsiveSidebar.propTypes = {
    drawerWidth: PropTypes.number.isRequired,
    handleDrawerToggle: PropTypes.func.isRequired,
    onAppSelect: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    window: PropTypes.node.isRequired,
    apps: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function ResponsiveSidebar(props) {
    const { window } = props;

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <SidebarContents apps={props.apps} onAppSelect={props.onAppSelect} />
            <Divider />
            <SidebarFooter />
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box
            component="nav"
            sx={{ width: { sm: props.drawerWidth }, flexShrink: { sm: 0 } }}
        >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
                container={container}
                variant="temporary"
                open={props.open}
                onClose={props.handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    'display': { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: props.drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    'display': { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: props.drawerWidth },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}

export default ResponsiveSidebar;
