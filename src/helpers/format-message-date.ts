export function formatMessageDate(date: Date) {
  const now = new Date();
  const messageDate = new Date(date);

  // Comprobamos si la fecha es hoy
  if (isToday(messageDate)) {
      return `hoy a las ${formatTime(messageDate)}`;
  }

  // Comprobamos si la fecha es ayer
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(messageDate, yesterday)) {
      return `ayer a las ${formatTime(messageDate)}`;
  }

  const formattedDate = messageDate.toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' });
  return `${formattedDate} a las ${formatTime(messageDate)}`;
}

export const formattedDate = (date: Date) => {
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' });
}

function isToday(date: Date) {
  const now = new Date();
  return isSameDay(date, now);
}

function isSameDay(date1: Date, date2: Date) {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

export function formatTime(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${formattedMinutes} ${ampm}`;
}
