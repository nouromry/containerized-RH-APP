import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import './recruiter.css';

const SkillsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data } = await api.get('/stats/skills-chart');
        setData(data);
      } catch (error) {
        console.error("Failed to fetch skills chart data", error);
      }
    };
    fetchChartData();
  }, []);

  return (
    <div className="dashboard-card chart-container">
      <h3>Top Required Skills</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#007bff" name="Times Required" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;