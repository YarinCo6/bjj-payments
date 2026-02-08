const MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

export default function Header({ month, year, onMonthChange, onYearChange }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <span className="logo-icon">🥋</span>
          <h1>מערכת קיזוז תשלומים</h1>
        </div>
        <p className="header-subtitle">BJJ Academy</p>
      </div>
      <div className="month-nav">
        <button
          className="nav-btn"
          onClick={() => {
            if (month === 0) {
              onMonthChange(11);
              onYearChange(year - 1);
            } else {
              onMonthChange(month - 1);
            }
          }}
        >
          ›
        </button>
        <div className="month-display">
          <span className="month-name">{MONTHS[month]}</span>
          <span className="month-year">{year}</span>
        </div>
        <button
          className="nav-btn"
          onClick={() => {
            if (month === 11) {
              onMonthChange(0);
              onYearChange(year + 1);
            } else {
              onMonthChange(month + 1);
            }
          }}
        >
          ‹
        </button>
      </div>
    </header>
  );
}
