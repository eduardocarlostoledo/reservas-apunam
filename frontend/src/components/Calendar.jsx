import { useState, useMemo } from 'react';

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function Calendar({ reservas = [], onSelectDate, selectedDate }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const reservaMap = useMemo(() => {
    const map = {};
    reservas.forEach(r => { map[r.fecha] = r.estado; });
    return map;
  }, [reservas]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function handleClick(day) {
    if (!day) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = new Date(year, month, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (dateObj < todayStart) return;
    if (reservaMap[dateStr]) return;
    onSelectDate?.(dateStr);
  }

  return (
    <div className="bg-surface rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-subtle transition-colors text-text">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 className="text-base font-semibold text-text">{MONTHS[month]} {year}</h3>
        <button onClick={nextMonth} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-subtle transition-colors text-text">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map(d => (
          <div key={d} className="text-xs font-semibold text-muted py-2">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const estado = reservaMap[dateStr];
          const dateObj = new Date(year, month, day);
          const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isPast = dateObj < todayStart;
          const isToday = dateObj.getTime() === todayStart.getTime();
          const isSelected = selectedDate === dateStr;

          let cls = 'relative w-full aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all duration-150 ';

          if (isPast) {
            cls += 'text-gray-300 cursor-default';
          } else if (estado === 'APROBADA') {
            cls += 'bg-red-50 text-red-400 cursor-default';
          } else if (estado === 'PENDIENTE') {
            cls += 'bg-amber-50 text-amber-500 cursor-default';
          } else if (isSelected) {
            cls += 'bg-brand text-white shadow-md shadow-brand/25 cursor-pointer scale-110';
          } else {
            cls += 'text-text hover:bg-brand-light hover:text-brand cursor-pointer';
          }

          return (
            <div key={dateStr} className={cls} onClick={() => handleClick(day)}>
              {day}
              {isToday && !isSelected && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-brand" />}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-5 mt-5 pt-4 border-t border-border">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-light border border-brand/30" /> Disponible
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-100 border border-amber-300" /> Pendiente
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <span className="w-2.5 h-2.5 rounded-full bg-red-100 border border-red-300" /> Reservado
        </span>
      </div>
    </div>
  );
}
