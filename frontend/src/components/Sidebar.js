import React from 'react';
import { Link } from 'react-router-dom';
import { Box, List, ListItem, ListItemText, Drawer, AppBar, Toolbar, Typography, Divider } from '@mui/material';
import { Dashboard, People, AccountBalance, Description } from '@mui/icons-material';

const Sidebar = () => {
  return (
    <Box sx={{ width: 240, height: '100vh', backgroundColor: '#2C3E50', color: 'white' }}>
      <AppBar position="sticky" sx={{ backgroundColor: '#34495E' }}>
        <Toolbar>
          <Typography variant="h6">Gestión Empresarial</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#2C3E50',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem button component={Link} to="/project-management" sx={{ '&:hover': { backgroundColor: '#1ABC9C' } }}>
            <Dashboard sx={{ marginRight: 2 }} />
            <ListItemText primary="Módulo de Gestión de Proyectos" />
          </ListItem>
          <Divider sx={{ backgroundColor: 'white' }} />
          <ListItem button component={Link} to="/employee-control" sx={{ '&:hover': { backgroundColor: '#1ABC9C' } }}>
            <People sx={{ marginRight: 2 }} />
            <ListItemText primary="Módulo de Control de Empleados" />
          </ListItem>
          <Divider sx={{ backgroundColor: 'white' }} />
          <ListItem button component={Link} to="/billing" sx={{ '&:hover': { backgroundColor: '#1ABC9C' } }}>
            <AccountBalance sx={{ marginRight: 2 }} />
            <ListItemText primary="Módulo de Facturación y Contabilidad" />
          </ListItem>
          <Divider sx={{ backgroundColor: 'white' }} />
          <ListItem button component={Link} to="/document-management" sx={{ '&:hover': { backgroundColor: '#1ABC9C' } }}>
            <Description sx={{ marginRight: 2 }} />
            <ListItemText primary="Módulo de Gestión Documental" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
