import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  const getDays = axios.get("/api/days");
  const getAppointments = axios.get("/api/appointments");
  const getInterViewers = axios.get("/api/interviewers");

  useEffect(() => {
    Promise.all([getDays, getAppointments, getInterViewers]).then((values) =>
      setState({
        ...state,
        days: values[0].data,
        appointments: values[1].data,
        interviewers: values[2].data,
      })
    );
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = displayDaysWithSpots(state.days, appointments);

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then((res) => setState({ ...state, days, appointments }));
  }

  function getSpotsRemaining(appointments, day) {
    const todaySpots = day.appointments;
    let spotCount = 0;

    for (const spot of todaySpots) {
      if (!appointments[spot].interview) {
        spotCount++;
      }
    }
    return spotCount;
  }

  function displayDaysWithSpots(days, appointments) {
    const dailyWSpots = days.map((day) => ({
      ...day,
      spots: getSpotsRemaining(appointments, day),
    }));
    return dailyWSpots;
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = displayDaysWithSpots(state.days, appointments);

    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then((res) => setState({ ...state, days, appointments }));
  }
  return { state, setDay, bookInterview, cancelInterview };
}
