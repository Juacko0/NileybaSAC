// components/ProgresoRadial.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

const COLORS = ['#1976d2', '#e0e0e0']; // Azul para progreso, gris para restante

const ProgresoRadial = ({ tareas }) => {
  const calcularProgreso = () => {
    if (!tareas || tareas.length === 0) return 0;
    const total = tareas.length;
    let acumulado = 0;

    tareas.forEach((tarea) => {
      switch (tarea.estado) {
        case 'completada':
          acumulado += 1;
          break;
        case 'en progreso':
          acumulado += 0.5;
          break;
        default:
          break;
      }
    });

    return Math.round((acumulado / total) * 100);
  };

  const progreso = calcularProgreso();
  const data = [
    { name: 'Progreso', value: progreso },
    { name: 'Restante', value: 100 - progreso },
  ];

  return (
    <Box sx={{ width: 150, height: 150, position: 'relative', mx: 'auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={50}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} cornerRadius={5} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6">{progreso}%</Typography>
        <Typography variant="caption">Completado</Typography>
      </Box>
    </Box>
  );
};

export default ProgresoRadial;
