import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function BalanceChart({ data }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h2 className="text-xl font-bold mb-2">Balance Mensual</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ingreso" stroke="#82ca9d" />
          <Line type="monotone" dataKey="gasto" stroke="#ff4d4f" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
