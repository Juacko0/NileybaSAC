import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Box, Paper } from '@mui/material';
import Sidebar from './components/Sidebar';
import ProjectManagement from './pages/ProjectManagement';
import EmployeeControl from './pages/EmployeeControl';
import Billing from './pages/Billing';
import DocumentManagement from './pages/DocumentManagement';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        {/* Barra lateral */}
        <Sidebar />
        
        {/* Contenido principal */}
        <Container
          sx={{
            marginLeft: '240px',
            padding: '20px',
            flex: 1,
            minHeight: '100vh',
            backgroundColor: '#ECF0F1',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Paper elevation={3} sx={{ padding: '20px', borderRadius: 2 }}>
            <Routes>
              <Route path="/project-management" element={<ProjectManagement />} />
              <Route path="/employee-control" element={<EmployeeControl />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/document-management" element={<DocumentManagement />} />
              <Route path="/" element={<ProjectManagement />} /> {/* Ruta por defecto */}
            </Routes>
          </Paper>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
