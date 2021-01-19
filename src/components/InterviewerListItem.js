import React from "react";
import { action } from "@storybook/addon-actions/dist/preview";

import "components/InterviewerListItem.scss";
import classNames from "classnames";

export default function InterviewerListItem(props) {
  const interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });

  const imageClass = classNames("interviewers__item-image", {
    "interviewers__item-image--selected": props.selected,
  });

  return (
    <li className={interviewerClass} onClick={props.onClick}>
      <img className={imageClass} src={props.avatar} alt={props.name} />
      {props.selected && props.name}
    </li>
  );
}
