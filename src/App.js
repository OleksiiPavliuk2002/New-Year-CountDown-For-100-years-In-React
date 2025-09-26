import React, { useEffect, useMemo, useState } from "react";

function createYearOptions(startYear, yearsAhead = 50) {
  const result = [];
  for (let y = startYear; y <= startYear + yearsAhead; y++) {
    result.push(String(y));
  }
  return result;
}

function getNewYearDatetime(targetYear) {
  return new Date(targetYear, 0, 1, 0, 0, 0, 0);
}

function twoDigits(num) {
  return String(num).padStart(2, "0");
}

export default function App() {
  const now = new Date();
  const currentYear = now.getFullYear();

  const upcomingYearDefault = now < getNewYearDatetime(currentYear) ? currentYear : currentYear + 1;

  const [selectedYear, setSelectedYear] = useState(String(upcomingYearDefault));
  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const yearOptions = useMemo(() => createYearOptions(currentYear + 1, 50), [currentYear]);

  const targetLabel = `Цель: 1 января ${selectedYear} 00:00:00`;
  useEffect(() => {
    function update() {
      const now = new Date();
      const target = getNewYearDatetime(Number(selectedYear));
      let totalSeconds = Math.floor((target - now) / 1000);
      if (totalSeconds < 0) totalSeconds = 0;

      const days = Math.floor(totalSeconds / 86400);
      const remAfterDays = totalSeconds % 86400;
      const hours = Math.floor(remAfterDays / 3600);
      const remAfterHours = remAfterDays % 3600;
      const minutes = Math.floor(remAfterHours / 60);
      const seconds = remAfterHours % 60;

      setRemaining({
        days,
        hours,
        minutes,
        seconds
      });
    }

    update(); 
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [selectedYear]);

  const digitColor = "#1E88E5";
  const unitColor = "#6b6b6b";

  return (
    <div className="app-root">
      <div className="container">
        <h1 className="title">До Нового года осталось:</h1>

        <div className="year-row">
          <label className="year-label" htmlFor="year-select">Выберите год:</label>
          <select
            id="year-select"
            className="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="target-label">{targetLabel}</div>

        <div className="timer-frame" role="timer" aria-live="polite">
          <div className="time-column">
            <div className="digit" style={{ color: digitColor }}>{remaining.days}</div>
            <div className="unit" style={{ color: unitColor }}>дн</div>
          </div>

          <div className="separator">:</div>

          <div className="time-column">
            <div className="digit" style={{ color: digitColor }}>{twoDigits(remaining.hours)}</div>
            <div className="unit" style={{ color: unitColor }}>ч</div>
          </div>

          <div className="separator">:</div>

          <div className="time-column">
            <div className="digit" style={{ color: digitColor }}>{twoDigits(remaining.minutes)}</div>
            <div className="unit" style={{ color: unitColor }}>мин</div>
          </div>

          <div className="separator">:</div>

          <div className="time-column">
            <div className="digit" style={{ color: digitColor }}>{twoDigits(remaining.seconds)}</div>
            <div className="unit" style={{ color: unitColor }}>с</div>
          </div>
        </div>
      </div>
    </div>
  );
}
