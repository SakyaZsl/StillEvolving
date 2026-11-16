import { beijingTime, calculateEarnings, isValidCalendar } from './calculator.mjs';

const SALARY_KEY = 'work-encourager:monthly-salary';
const HIDDEN_KEY = 'work-encourager:hide-amounts';
const CALENDAR_KEY_PREFIX = 'work-encourager:calendar:';
const moneyFormatter = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const elements = {
  todayEarned: document.querySelector('#today-earned'),
  monthEarned: document.querySelector('#month-earned'),
  secondRate: document.querySelector('#second-rate'),
  salaryDisplay: document.querySelector('#salary-display'),
  workStatus: document.querySelector('#work-status'),
  statusText: document.querySelector('#status-text'),
  counterHint: document.querySelector('#counter-hint'),
  progressFill: document.querySelector('#progress-fill'),
  progressTrack: document.querySelector('#progress-track'),
  progressLabel: document.querySelector('#progress-label'),
  encouragementText: document.querySelector('#encouragement-text'),
  monthNote: document.querySelector('#month-note'),
  calendarWarning: document.querySelector('#calendar-warning'),
  privacyToggle: document.querySelector('#privacy-toggle'),
  eyeIcon: document.querySelector('#eye-icon'),
  settingsButton: document.querySelector('#settings-button'),
  salaryDialog: document.querySelector('#salary-dialog'),
  salaryForm: document.querySelector('#salary-form'),
  salaryInput: document.querySelector('#salary-input'),
  salaryError: document.querySelector('#salary-error'),
  dialogClose: document.querySelector('#dialog-close'),
};

function readStorage(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Private mode may disable storage. */ }
}

function parseSalary(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 && number <= 1_000_000_000
    ? Math.round(number * 100) / 100
    : null;
}

let salary = parseSalary(readStorage(SALARY_KEY));
let amountsHidden = readStorage(HIDDEN_KEY) === 'true';
let calendar = null;
let calendarYear = null;
let calendarLoading = false;

async function fetchCalendar(url, year, timeout = 5000) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeout) });
  if (!response.ok) throw new Error(`Calendar request failed: ${response.status}`);
  const data = await response.json();
  if (!isValidCalendar(data, year)) throw new Error(`Calendar for ${year} is not published`);
  return data;
}

async function loadCalendar(year) {
  calendarLoading = true;
  calendarYear = year;
  calendar = null;

  let nextCalendar = null;
  const embedded = globalThis.__EMBEDDED_CALENDARS__?.[year];

  if (isValidCalendar(embedded, year)) {
    nextCalendar = embedded;
  } else {
    try {
      nextCalendar = await fetchCalendar(`./data/${year}.json`, year);
    } catch { /* A double-clicked file cannot fetch neighboring local files. */ }

    if (!nextCalendar) {
      const cached = readStorage(`${CALENDAR_KEY_PREFIX}${year}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (isValidCalendar(parsed, year)) nextCalendar = parsed;
        } catch { /* Ignore a damaged cache. */ }
      }

      try {
        // Annual data is published after the official Chinese holiday schedule is announced.
        const url = `https://cdn.jsdelivr.net/npm/chinese-days@latest/dist/years/${year}.json`;
        nextCalendar = await fetchCalendar(url, year);
        writeStorage(`${CALENDAR_KEY_PREFIX}${year}`, JSON.stringify(nextCalendar));
      } catch { /* Fall back to Monday–Friday and show a visible estimate notice. */ }
    }
  }

  if (calendarYear !== year) return;
  calendar = nextCalendar;
  calendarLoading = false;
  render();
}

function ensureCalendar(year) {
  if (calendarYear !== year) void loadCalendar(year);
}

function formattedAmount(amount, withCurrency = true) {
  if (amountsHidden) return '••••••';
  return `${withCurrency ? '¥' : ''}${moneyFormatter.format(amount)}`;
}

function encouragement(progress, status) {
  if (status === 'rest') return '今天的任务：好好休息，快乐充电。';
  if (status === 'before') return '今天的好运，从开工开始。';
  if (progress >= 1) return '收工！今天的赚钱进度已经攒满啦。';
  if (progress >= 0.75) return '再坚持一小会儿，下班就在前方。';
  if (progress >= 0.5) return '已经过半，今天的努力很有“钱”景。';
  if (progress >= 0.25) return '四分之一到手，继续稳稳地赚。';
  if (status === 'lunch') return '午休时间，收入先歇一会儿，你也歇会儿。';
  return '刚开工，每一秒都在悄悄变值钱。';
}

function statusCopy(result) {
  if (result.status === 'rest') {
    return result.todayInfo.isHoliday
      ? ['法定假日', '今天放假，收入暂停累计。']
      : ['休息日', '今天休息，收入暂停累计。'];
  }
  if (result.status === 'before') return ['尚未上班', '09:00 开始计算今天的收入。'];
  if (result.status === 'lunch') return ['午休中', '午休不计时，13:30 继续赚钱。'];
  if (result.status === 'after') return ['已经下班', '今日 7.5 小时已完成，辛苦啦！'];
  if (result.todayInfo.isMakeupDay) return ['调休上班', '今天是补班日，每一秒都算数。'];
  return ['工作中', '每一秒都在把努力变成收入。'];
}

function render() {
  const now = new Date();
  const beijing = beijingTime(now);
  ensureCalendar(beijing.year);

  elements.privacyToggle.setAttribute('aria-pressed', String(amountsHidden));
  elements.privacyToggle.setAttribute('aria-label', amountsHidden ? '显示金额' : '隐藏金额');
  elements.privacyToggle.title = amountsHidden ? '显示金额' : '隐藏金额';
  elements.eyeIcon.classList.toggle('is-hidden', amountsHidden);

  elements.calendarWarning.hidden = calendarLoading || Boolean(calendar);
  if (!salary) {
    elements.todayEarned.textContent = amountsHidden ? '••••••' : '0.00';
    elements.monthEarned.textContent = formattedAmount(0);
    elements.secondRate.textContent = formattedAmount(0);
    elements.salaryDisplay.textContent = '未设置';
    return;
  }

  const result = calculateEarnings(salary, now, calendar);
  const [status, hint] = statusCopy(result);
  const progressPercent = Math.round(result.progress * 100);

  elements.todayEarned.textContent = formattedAmount(result.todayEarned, false);
  elements.monthEarned.textContent = formattedAmount(result.monthEarned);
  elements.secondRate.textContent = formattedAmount(result.secondRate);
  elements.salaryDisplay.textContent = formattedAmount(salary);
  elements.workStatus.dataset.status = result.status;
  elements.statusText.textContent = status;
  elements.counterHint.textContent = hint;
  elements.progressLabel.textContent = `${progressPercent}%`;
  elements.progressFill.style.width = `${result.progress * 100}%`;
  elements.progressTrack.setAttribute('aria-valuenow', String(progressPercent));
  elements.encouragementText.textContent = encouragement(result.progress, result.status);
  elements.monthNote.textContent = `${beijing.year} 年 ${beijing.month} 月 · ${result.workdays} 个工作日${calendar ? '' : '（估算）'}`;
}

function scheduleNextTick() {
  const delay = 1020 - (Date.now() % 1000);
  setTimeout(() => {
    render();
    scheduleNextTick();
  }, delay);
}

function openSalaryDialog() {
  elements.salaryInput.value = salary ? String(salary) : '';
  elements.salaryError.hidden = true;
  elements.salaryDialog.showModal();
  elements.salaryInput.focus();
}

elements.salaryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nextSalary = parseSalary(elements.salaryInput.value);
  if (!nextSalary) {
    elements.salaryError.hidden = false;
    elements.salaryInput.focus();
    return;
  }
  salary = nextSalary;
  writeStorage(SALARY_KEY, String(salary));
  elements.salaryDialog.close();
  render();
});

elements.salaryInput.addEventListener('input', () => { elements.salaryError.hidden = true; });
elements.dialogClose.addEventListener('click', () => elements.salaryDialog.close());
elements.settingsButton.addEventListener('click', openSalaryDialog);
elements.privacyToggle.addEventListener('click', () => {
  amountsHidden = !amountsHidden;
  writeStorage(HIDDEN_KEY, String(amountsHidden));
  render();
});

document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
window.addEventListener('focus', render);

render();
scheduleNextTick();
if (!salary) openSalaryDialog();
