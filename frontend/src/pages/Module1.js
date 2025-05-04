import React from 'react';
import { useQuery } from 'react-query';
import { fetchData } from '../services/api';
import CustomButton from '../components/Button';

const Module1 = () => {
  const { data, error, isLoading } = useQuery('module1Data', () => fetchData('/module1'));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Módulo 1</h1>
      <CustomButton label="Hacer algo" onClick={() => console.log('Acción')} />
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Module1;
