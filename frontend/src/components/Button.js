import React from 'react';
import Button from '@mui/material/Button';

const CustomButton = ({ onClick, label }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      {label}
    </Button>
  );
};

export default CustomButton;
