const getStartOfWeek = (dateString = new Date()) => {
  const date = new Date(dateString);
  const day = date.getDay() || 7; // Get current day number, converting Sun. to 7
  if (day !== 1) {
    date.setHours(-24 * (day - 1)); // Set to previous Monday
  }
  return date.toISOString().split('T')[0];
};

const getEndOfWeek = (dateString = new Date()) => {
  const date = new Date(getStartOfWeek(dateString));
  date.setDate(date.getDate() + 6);
  return date.toISOString().split('T')[0];
};

const calculateDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
};

const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};

const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

module.exports = {
  getStartOfWeek,
  getEndOfWeek,
  calculateDaysDifference,
  getYesterday,
  getToday
};
