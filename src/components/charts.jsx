import { LineChart, Line , CartesianGrid, XAxis , YAxis , Tooltip } from 'recharts'
function Charts() {
  const data = [
  { name: "Jan", appointments: 30 },
  { name: "Feb", appointments: 45 },
  { name: "Mar", appointments: 50 },
];
  return (
    <div>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="appointments" stroke="#8884d8" />
      </LineChart>
    </div>
  )
}

export default Charts
