import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  const getDays = axios.get("http://localhost:8001/api/days");
  const getAppointments = axios.get("http://localhost:8001/api/appointments");
  const getInterViewers = axios.get("http://localhost:8001/api/interviewers");

  useEffect(() => {
    Promise.all([getDays, getAppointments, getInterViewers]).then((values) =>
      setState({
        ...state,
        days: values[0].data,
        appointments: values[1].data,
        interviewers: values[2].data,
      })
    );
  }, [state.appointments]);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then((res) => setState({ ...state, appointments }));
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
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then((res) => setState({ ...state, appointments }));
  }
  return { state, setDay, bookInterview, cancelInterview };
}
