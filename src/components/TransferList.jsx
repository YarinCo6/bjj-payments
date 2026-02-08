export default function TransferList({ transfers }) {
  if (!transfers || transfers.length === 0) return null;

  return (
    <div className="transfer-list">
      <h2 className="section-title">העברות סופיות לביצוע</h2>
      <div className="transfers">
        {transfers.map((t, i) => (
          <div key={i} className="transfer-item">
            <div className="transfer-flow">
              <span className="transfer-person from">{t.from}</span>
              <span className="transfer-arrow">←</span>
              <span className="transfer-amount amount-pay">₪{t.amount}</span>
              <span className="transfer-arrow">→</span>
              <span className="transfer-person to">{t.to}</span>
            </div>
            <p className="transfer-reason">{t.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
