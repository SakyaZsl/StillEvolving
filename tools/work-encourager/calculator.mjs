export const WORK_SECONDS_PER_DAY = 7.5 * 60 * 60;

const MORNING_START = 9 * 60 * 60;
const MORNING_END = 12 * 60 * 60;
const AFTERNOON_START = 13.5 * 60 * 60;
const AFTERNOON_END = 18 * 60 * 60;

const beijingFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export function beijingTime(date) {
  const parts = Object.fromEntries(
    beijingFormatter.formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, Number(value)]),
  );

  return {
    ...parts,
    dateKey: dateKey(parts.year, parts.month, parts.day),
    secondOfDay: parts.hour * 3600 + parts.minute * 60 + parts.second,
  };
}

export function dateKey(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function isValidCalendar(data, year) {
  if (!data || typeof data !== 'object' || !data.holidays || !data.workdays) return false;
  if (typeof data.holidays !== 'object' || typeof data.workdays !== 'object') return false;
  const dates = [...Object.keys(data.holidays), ...Object.keys(data.workdays)];
  return dates.length > 0 && dates.every((date) => date.startsWith(`${year}-`));
}

export function workdayInfo(year, month, day, calendar) {
  const key = dateKey(year, month, day);
  if (calendar?.workdays && Object.hasOwn(calendar.workdays, key)) {
    return { isWorkday: true, isMakeupDay: true, isHoliday: false };
  }
  if (calendar?.holidays && Object.hasOwn(calendar.holidays, key)) {
    return { isWorkday: false, isMakeupDay: false, isHoliday: true };
  }

  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return { isWorkday: weekday >= 1 && weekday <= 5, isMakeupDay: false, isHoliday: false };
}

export function countWorkdays(year, month, calendar) {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  let total = 0;
  for (let day = 1; day <= daysInMonth; day += 1) {
    if (workdayInfo(year, month, day, calendar).isWorkday) total += 1;
  }
  return total;
}

function elapsedInRange(secondOfDay, start, end) {
  return Math.max(0, Math.min(secondOfDay, end) - start);
}

export function elapsedWorkSeconds(secondOfDay) {
  return elapsedInRange(secondOfDay, MORNING_START, MORNING_END)
    + elapsedInRange(secondOfDay, AFTERNOON_START, AFTERNOON_END);
}

export function calculateEarnings(salary, date, calendar) {
  const now = beijingTime(date);
  const workdays = countWorkdays(now.year, now.month, calendar);
  const todayInfo = workdayInfo(now.year, now.month, now.day, calendar);
  let completedWorkdays = 0;
  for (let day = 1; day < now.day; day += 1) {
    if (workdayInfo(now.year, now.month, day, calendar).isWorkday) completedWorkdays += 1;
  }

  const elapsedToday = todayInfo.isWorkday ? elapsedWorkSeconds(now.secondOfDay) : 0;
  const dailyRate = salary / workdays;
  const secondRate = dailyRate / WORK_SECONDS_PER_DAY;
  const todayEarned = elapsedToday * secondRate;
  const monthEarned = (completedWorkdays * WORK_SECONDS_PER_DAY + elapsedToday) * secondRate;

  let status = 'rest';
  if (todayInfo.isWorkday) {
    if (now.secondOfDay < MORNING_START) status = 'before';
    else if (now.secondOfDay < MORNING_END) status = 'working';
    else if (now.secondOfDay < AFTERNOON_START) status = 'lunch';
    else if (now.secondOfDay < AFTERNOON_END) status = 'working';
    else status = 'after';
  }

  return {
    now,
    workdays,
    todayInfo,
    elapsedToday,
    dailyRate,
    secondRate,
    todayEarned,
    monthEarned,
    progress: elapsedToday / WORK_SECONDS_PER_DAY,
    status,
  };
}
