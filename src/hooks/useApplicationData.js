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

    const day = state.days.filter((day) => day.name === state.day);

    const updatedDay = { ...day[0], spots: day[0].spots - 1 };

    const otherDays = state.days.filter((day) => day.name !== state.day);

    const days = [...otherDays, updatedDay];

    days.sort((a, b) => {
      return a.id - b.id;
    });

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then((res) => setState({ ...state, days, appointments }));
  }

  // function getSpotsRemaining(state, day) {
  //   const dayInfo = state.days.filter((days) => days.name === day);
  //   let spotCount = 0;
  //   console.log("dayInfo", dayInfo);
  //   console.log("Appointments for that day", dayInfo[0].appointments);
  //   for (const appt in state.appointments) {
  //     if (
  //       dayInfo[0].appointments.includes(state.appointments[appt].id) &&
  //       !state.appointments[appt].interview
  //     ) {
  //       spotCount++;
  //     }
  //   }
  //   return spotCount;
  // }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const day = state.days.filter((day) => day.name === state.day);

    const updatedDay = { ...day[0], spots: day[0].spots + 1 };

    const otherDays = state.days.filter((day) => day.name !== state.day);

    const days = [...otherDays, updatedDay];

    days.sort((a, b) => {
      return a.id - b.id;
    });
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then((res) => setState({ ...state, days, appointments }));
  }
  return { state, setDay, bookInterview, cancelInterview };
}
