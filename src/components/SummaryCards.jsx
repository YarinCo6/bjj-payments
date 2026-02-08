export default function SummaryCards({ summaries }) {
  if (!summaries) return null;

  const people = [
    { key: 'omer', name: 'עומר', role: 'בעל המכון', emoji: '👑' },
    { key: 'gadi', name: 'גדי', role: 'עובד', emoji: '🥊' },
    { key: 'yarin', name: 'ירין', role: 'עובד', emoji: '💪' },
  ];

  return (
    <div className="summary-cards">
      <h2 className="section-title">סיכום אישי</h2>
      <div className="cards-grid">
        {people.map(({ key, name, role, emoji }) => {
          const s = summaries[key];
          const net = s.receives - s.pays;
          return (
            <div key={key} className="summary-card">
              <div className="card-header">
                <span className="card-emoji">{emoji}</span>
                <div>
                  <h3 className="card-name">{name}</h3>
                  <span className="card-role">{role}</span>
                </div>
              </div>

              <div className="card-amounts">
                {s.receives > 0 && (
                  <div className="card-amount">
                    <span className="amount-label">מקבל</span>
                    <span className="amount-receive">₪{s.receives}</span>
                  </div>
                )}
                {s.pays > 0 && (
                  <div className="card-amount">
                    <span className="amount-label">משלם</span>
                    <span className="amount-pay">₪{s.pays}</span>
                  </div>
                )}
                <div className="card-amount card-net">
                  <span className="amount-label">נטו</span>
                  <span className={net >= 0 ? 'amount-receive' : 'amount-pay'}>
                    {net >= 0 ? '+' : ''}₪{net}
                  </span>
                </div>
              </div>

              {s.details.length > 0 && (
                <ul className="card-details">
                  {s.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
