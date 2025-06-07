import { useState } from 'react'
const Appointment = () => {
    const [ appointment, setAppointments ] = useState([])
    const [form , setForm] = useState({name: "" , date: ""})

    const handleAdd = () => {
      setAppointments([...appointment, {...form, id: Date.now()}])   
        setForm({name: "", date: ""})
    }

    const handleDelete = (id) => {
        setAppointments(appointment.filter((a) => a.id !== id))
    }
  return (
    <div>
        <h2>Appointments</h2>
        <div>
            <input 
                type="text" 
                placeholder="Name" 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})} 
            />
            <input 
                type="date" 
                value={form.date} 
                onChange={(e) => setForm({...form, date: e.target.value})}
        />
            <button onClick={handleAdd}>Add Appointment</button>
                </div>
        <ul>
            {appointment.map((a) => (
                <li key={a.id}>
                    {a.name} - {a.date}
                    <button onClick={() => handleDelete(a.id)}>Delete</button>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default Appointment
