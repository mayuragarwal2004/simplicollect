function generatePeriods(periodType, termStart, termEnd, weekStartDay = 0) {
  const periods = [];
  let current = new Date(termStart);
  let idx = 1;

  while (current <= termEnd) {
    let periodStart = new Date(current);
    let periodEnd;
    let label;

    if (periodType === 'weekly') {
      const offset = (7 + periodStart.getDay() - weekStartDay) % 7;
      periodStart.setDate(periodStart.getDate() - offset); // Adjust to start of week
      periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 6);
      label = `Week ${idx}`;
    } else if (periodType === 'monthly') {
      periodEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
      label = `${current.toLocaleString('default', { month: 'short' })} ${current.getFullYear()}`;
    } else if (periodType === '3monthly') {
      periodEnd = new Date(current.getFullYear(), current.getMonth() + 3, 0);
      const quarter = Math.floor(current.getMonth() / 3) + 1;
      label = `Q${quarter} ${current.getFullYear()}`;
    }

    if (periodEnd > termEnd) periodEnd = new Date(termEnd);

    periods.push({ start: new Date(periodStart), end: new Date(periodEnd), label });

    if (periodType === 'weekly') {
      current.setDate(current.getDate() + 7);
    } else if (periodType === 'monthly') {
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    } else if (periodType === '3monthly') {
      current = new Date(current.getFullYear(), current.getMonth() + 3, 1);
    }
    idx++;
  }

  return periods;
}

module.exports = { generatePeriods };
