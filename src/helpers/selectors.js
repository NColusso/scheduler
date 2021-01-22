function getAppointmentsForDay(state, day) {
  // get interviews only for chosen day
  const dayInfo = state.days.filter((days) => days.name === day);
  const daysAppointments = [];

  if (!dayInfo.length) {
    return dayInfo;
  }
  // Get just the appointments out of the returned day
  const apptsForDayArray = dayInfo[0].appointments;
  for (const appointment in state.appointments) {
    // if the appointment id is included in the appointments array push whole appointment into result
    if (apptsForDayArray.includes(state.appointments[appointment].id)) {
      daysAppointments.push(state.appointments[appointment]);
    }
  }
  return daysAppointments;
}

function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer;
  const interviewerInfo = state.interviewers[interviewerId];

  const theInterview = {
    student: interview.student,
    interviewer: interviewerInfo,
  };

  return theInterview;
}

function getInterviewersForDay(state, day) {
  // get interviews only for chosen day
  const dayInfo = state.days.filter((days) => days.name === day);
  const daysInterviewers = [];
  if (!dayInfo.length) {
    return dayInfo;
  }
  // Get just the appointments out of the returned day
  const interviewersForDayArray = dayInfo[0].interviewers;
  for (const interviewer in state.interviewers) {
    // if the appointment id is included in the appointments array push whole appointment into result
    if (interviewersForDayArray.includes(state.interviewers[interviewer].id)) {
      daysInterviewers.push(state.interviewers[interviewer]);
    }
  }
  return daysInterviewers;
}

export { getAppointmentsForDay, getInterview, getInterviewersForDay };
