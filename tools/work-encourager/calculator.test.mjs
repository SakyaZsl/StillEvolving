import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  beijingTime,
  calculateEarnings,
  countWorkdays,
  elapsedWorkSeconds,
  isValidCalendar,
  workdayInfo,
} from './calculator.mjs';

const calendar = JSON.parse(readFileSync(new URL('../../public/tools/work-encourager/data/2026.json', import.meta.url), 'utf8'));

test('2026 calendar data is valid and includes holiday and makeup day overrides', () => {
  assert.equal(isValidCalendar(calendar, 2026), true);
  assert.equal(workdayInfo(2026, 1, 1, calendar).isWorkday, false);
  assert.equal(workdayInfo(2026, 1, 4, calendar).isWorkday, true);
  assert.equal(workdayInfo(2026, 1, 4, calendar).isMakeupDay, true);
  assert.equal(countWorkdays(2026, 1, calendar), 21);
});

test('Beijing time is used regardless of the viewer time zone', () => {
  const result = beijingTime(new Date('2026-11-02T23:30:00Z'));
  assert.equal(result.dateKey, '2026-11-03');
  assert.equal(result.hour, 7);
  assert.equal(result.minute, 30);
});

test('work seconds pause at lunch and stop after 7.5 hours', () => {
  assert.equal(elapsedWorkSeconds(8 * 3600), 0);
  assert.equal(elapsedWorkSeconds(12 * 3600), 3 * 3600);
  assert.equal(elapsedWorkSeconds(13 * 3600), 3 * 3600);
  assert.equal(elapsedWorkSeconds(18 * 3600), 7.5 * 3600);
  assert.equal(elapsedWorkSeconds(23 * 3600), 7.5 * 3600);
});

test('a makeup Sunday earns income and a statutory holiday does not', () => {
  const makeup = calculateEarnings(6000, new Date('2026-01-04T02:00:00Z'), calendar);
  const holiday = calculateEarnings(6000, new Date('2026-01-01T02:00:00Z'), calendar);
  assert.equal(makeup.status, 'working');
  assert.equal(makeup.todayInfo.isMakeupDay, true);
  assert.ok(makeup.todayEarned > 0);
  assert.equal(holiday.status, 'rest');
  assert.equal(holiday.todayEarned, 0);
});

test('today and month totals use actual workdays and reach salary at month end', () => {
  const lunch = calculateEarnings(2100, new Date('2026-11-03T04:30:00Z'), calendar);
  const after = calculateEarnings(2100, new Date('2026-11-30T10:00:00Z'), calendar);
  assert.equal(lunch.workdays, 21);
  assert.equal(lunch.status, 'lunch');
  assert.equal(lunch.dailyRate, 100);
  assert.equal(lunch.todayEarned, 40);
  assert.equal(lunch.monthEarned, 140);
  assert.equal(after.progress, 1);
  assert.ok(Math.abs(after.monthEarned - 2100) < 1e-9);
});

test('a missing official calendar falls back to Monday through Friday', () => {
  assert.equal(workdayInfo(2027, 1, 2, null).isWorkday, false);
  assert.equal(workdayInfo(2027, 1, 4, null).isWorkday, true);
  const result = calculateEarnings(10000, new Date('2027-01-04T02:00:00Z'), null);
  assert.ok(result.todayEarned > 0);
});
