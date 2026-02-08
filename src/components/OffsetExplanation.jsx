export default function OffsetExplanation({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="offset-explanation">
      <h2 className="section-title">הסבר לוגי</h2>
      <div className="steps-list">
        {steps.map((step, i) => (
          <div key={i} className="step-item">
            <span className="step-number">{i + 1}</span>
            <p className="step-text">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
