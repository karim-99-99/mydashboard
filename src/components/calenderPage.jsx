import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
const CalendarPage = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Calendar</h2>
      <Calendar onChange={setDate} value={date} />
      <p className="mt-4">Selected date: {date.toDateString()}</p>
    </div>
  );
};
 export default CalendarPage;