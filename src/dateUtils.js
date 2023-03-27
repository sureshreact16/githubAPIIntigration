import moment from "moment";

export const getRelativeTime = (dateTimeString) => {
  const specifiedDateTime = moment(dateTimeString);
  const diff = specifiedDateTime.diff(moment(), "milliseconds");
  const duration = moment.duration(diff);
  return duration.humanize();
};
