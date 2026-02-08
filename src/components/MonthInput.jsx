import { useState } from 'react';

export default function MonthInput({ data, onSave }) {
  const [privateSessions, setPrivateSessions] = useState(data.privateSessions || 0);
  const [groupSessions, setGroupSessions] = useState(data.groupSessions || 0);
  const [specialEvents, setSpecialEvents] = useState(data.specialEvents || []);
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventAmount, setNewEventAmount] = useState('');

  function handleAddEvent() {
    if (!newEventDesc || !newEventAmount) return;
    setSpecialEvents([
      ...specialEvents,
      { description: newEventDesc, amount: Number(newEventAmount) },
    ]);
    setNewEventDesc('');
    setNewEventAmount('');
  }

  function handleRemoveEvent(index) {
    setSpecialEvents(specialEvents.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      privateSessions: Number(privateSessions),
      groupSessions: Number(groupSessions),
      specialEvents,
    });
  }

  return (
    <form className="month-input" onSubmit={handleSubmit}>
      <h2 className="section-title">הזנת נתונים</h2>

      <div className="input-grid">
        <div className="input-group">
          <label>אימונים פרטיים (ירין)</label>
          <div className="input-with-info">
            <input
              type="number"
              min="0"
              value={privateSessions}
              onChange={(e) => setPrivateSessions(e.target.value)}
            />
            <span className="input-rate">× <span className="amount-pay">₪50</span> שכירות לעומר</span>
          </div>
        </div>

        <div className="input-group">
          <label>אימונים קבוצתיים (ירין)</label>
          <div className="input-with-info">
            <input
              type="number"
              min="0"
              value={groupSessions}
              onChange={(e) => setGroupSessions(e.target.value)}
            />
            <span className="input-rate">× <span className="amount-receive">₪150</span> מעומר</span>
          </div>
        </div>
      </div>

      <div className="special-events-section">
        <h3>אירועים מיוחדים <span className="hint">(ירין שילם על עומר)</span></h3>

        {specialEvents.length > 0 && (
          <ul className="events-list">
            {specialEvents.map((ev, i) => (
              <li key={i} className="event-item">
                <span>{ev.description}</span>
                <span className="amount-receive">₪{ev.amount}</span>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveEvent(i)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="add-event-row">
          <input
            type="text"
            placeholder="תיאור האירוע"
            value={newEventDesc}
            onChange={(e) => setNewEventDesc(e.target.value)}
          />
          <input
            type="number"
            placeholder="סכום"
            min="0"
            value={newEventAmount}
            onChange={(e) => setNewEventAmount(e.target.value)}
          />
          <button type="button" className="add-event-btn" onClick={handleAddEvent}>
            +
          </button>
        </div>
      </div>

      <button type="submit" className="calculate-btn">
        חשב קיזוז
      </button>
    </form>
  );
}
