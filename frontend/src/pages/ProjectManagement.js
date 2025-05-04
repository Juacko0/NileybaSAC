import React from 'react';
import { Paper, Typography } from '@mui/material';

const ProjectManagement = () => {
  return (
    <Paper elevation={3} sx={{ padding: '20px', borderRadius: 2, backgroundColor: '#FFF', boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Módulo de Gestión de Proyectos
      </Typography>
      <Typography variant="body1">
        Aquí puedes gestionar todos los proyectos de la empresa, asignar tareas y llevar un control de avances.
      </Typography>
    </Paper>
  );
};

export default ProjectManagement;
