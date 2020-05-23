
// Combine Date & Time objects to be a single date object
export const combineDateAndTime = (date: Date, time: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // month returns a number begging from 0;
  const day = date.getDate();

  const timeString = time.getHours() + ":" + time.getMinutes() + ":00";
  const dateString = `${year}-${month}-${day}`;

  return new Date(dateString + ' ' + timeString);
}