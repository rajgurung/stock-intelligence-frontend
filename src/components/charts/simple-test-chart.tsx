'use client';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const testData = [
  { name: 'A', value: 100 },
  { name: 'B', value: 200 },
  { name: 'C', value: 150 },
  { name: 'D', value: 300 }
];

export function SimpleTestChart() {
  return (
    <div style={{ width: '100%', height: '200px', background: '#fff', border: '1px solid #ccc' }}>
      <h3>Simple Test Chart</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={testData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Line dataKey="value" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}