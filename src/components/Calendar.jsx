import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
// import addMonths from "date-fns/addMonths";
// import subMonths from "date-fns/subMonths";
import startOfDay from "date-fns/startOfDay";
import addHours from "date-fns/addHours";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import {
  getAllAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "../utils/db";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CustomToolbar = (toolbar) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white">
      <button
        onClick={() => toolbar.onNavigate("PREV")}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h2 className="text-xl font-semibold">{toolbar.label}</h2>
      <button
        onClick={() => toolbar.onNavigate("NEXT")}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

const CustomEvent = () => {
  return (
    <div className="p-1 text-sm">
      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>
    </div>
  );
};

const DayView = ({ date, events, onHourClick, onEventClick }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = events.filter(
    (event) => format(event.start, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  return (
    <div className="h-full overflow-y-auto ">
      {hours.map((hour) => (
        <div
          key={hour}
          className="relative border-b border-orange-500 min-h-[60px] cursor-pointer hover:bg-gray-50"
          onClick={() => onHourClick(hour)}
        >
          <div className="absolute left-0 top-0 w-20 bg-gray-100 p-2 text-sm">
            {format(addHours(startOfDay(date), hour), "h a")}
          </div>
          <div className="ml-20 p-2">
            {dayEvents
              .filter((event) => format(event.start, "H") === hour.toString())
              .map((event, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white p-2 rounded mb-1 cursor-pointer hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                >
                  {event.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const TimeSelect = ({ label, value, onChange }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleHourChange = (e) => {
    const newDate = setHours(value, parseInt(e.target.value));
    onChange(newDate);
  };

  const handleMinuteChange = (e) => {
    const newDate = setMinutes(value, parseInt(e.target.value));
    onChange(newDate);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <select
          value={format(value, "H")}
          onChange={handleHourChange}
          className="border rounded p-2"
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {format(setHours(new Date(), hour), "h a")}
            </option>
          ))}
        </select>
        <select
          value={format(value, "mm")}
          onChange={handleMinuteChange}
          className="border rounded p-2"
        >
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {minute.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: null,
    end: null,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const appointments = await getAllAppointments();
      const eventsData = appointments.map((appointment) => ({
        ...appointment,
        start: new Date(appointment.start),
        end: new Date(appointment.end),
      }));

      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const handleSelect = ({ start }) => {
    setSelectedDate(start);
  };

  const handleHourClick = (hour) => {
    const startTime = setHours(selectedDate, hour);
    setSelectedEvent(null);
    setNewEvent({
      title: "",
      start: startTime,
      end: addHours(startTime, 1),
    });
    setShowModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setNewEvent(event);
    setShowModal(true);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title) {
      setError("Please enter an appointment title");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const eventData = {
        title: newEvent.title,
        start: newEvent.start.toISOString(),
        end: newEvent.end.toISOString(),
        createdAt: new Date().toISOString(),
      };

      if (selectedEvent) {
        await updateAppointment({ ...eventData, id: selectedEvent.id });
      } else {
        await addAppointment(eventData);
      }

      await fetchEvents();
      setShowModal(false);
      setNewEvent({
        title: "",
        start: null,
        end: null,
      });
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error saving event:", error);
      setError("Failed to save appointment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      setSaving(true);
      setError(null);
      await deleteAppointment(selectedEvent.id);
      await fetchEvents();
      setShowModal(false);
      setSelectedEvent(null);
      setNewEvent({
        title: "",
        start: null,
        end: null,
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete appointment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // const navigateToPreviousMonth = () => {
  //   setCurrentDate(subMonths(currentDate, 1));
  // };

  // const navigateToNextMonth = () => {
  //   setCurrentDate(addMonths(currentDate, 1));
  // };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="h-screen p-4">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}
      {/* <div className="flex justify-between items-center mb-4">
        <button
          onClick={navigateToPreviousMonth}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Previous Month
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={navigateToNextMonth}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next Month
        </button>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 z-50">
        <div className="h-[600px] shadow-lg border rounded-lg overflow-hidden">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSelect}
            onSelectEvent={handleEventClick}
            selectable
            views={["month"]}
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            style={{ height: "100%", backgroundColor: "white" }}
            eventPropGetter={() => ({
              style: {
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
                padding: "0",
                margin: "0",
                height: "auto",
              },
            })}
            components={{
              toolbar: CustomToolbar,
              event: CustomEvent,
            }}
            dayPropGetter={(date) => {
              const isToday =
                format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
              return {
                style: {
                  backgroundColor: "white",
                  color: "#000000",
                  fontWeight: isToday ? "bold" : "normal",
                },
              };
            }}
          />
        </div>
        <div className="h-[600px] border  overflow-hidden rounded-xl bg-[#ffffff] shadow-xl">
          <div className=" p-4 border-b">
            <h3 className="text-lg font-semibold">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
          </div>
          <DayView
            date={selectedDate}
            events={events}
            onHourClick={handleHourClick}
            onEventClick={handleEventClick}
            className="bg-[#ffefd7]"
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg w-96 ">
            <h2 className="text-xl mb-4">
              {selectedEvent ? "Edit Appointment" : "Add Appointment"}
            </h2>
            <input
              type="text"
              placeholder="Appointment Title"
              className="border p-2 mb-4 w-full"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <div className="text-sm text-gray-600 mb-4">
              Time: {format(newEvent.start, "h:mm a")} -{" "}
              {format(newEvent.end, "h:mm a")}
            </div>
            <div className="flex justify-end gap-2">
              {selectedEvent && (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                  onClick={handleDeleteEvent}
                  disabled={saving}
                >
                  {saving ? "Deleting..." : "Delete"}
                </button>
              )}
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setShowModal(false);
                  setSelectedEvent(null);
                  setError(null);
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={handleAddEvent}
                disabled={saving}
              >
                {saving ? "Saving..." : selectedEvent ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
