import { useState, useEffect } from 'react';
import Header from './components/Header';
import MonthInput from './components/MonthInput';
import SummaryCards from './components/SummaryCards';
import OffsetExplanation from './components/OffsetExplanation';
import TransferList from './components/TransferList';
import { calculateOffsets } from './utils/calculator';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

function getMonthKey(month, year) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export default function App() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [allData, setAllData] = useLocalStorage('bjj-payments-data', {});
  const [result, setResult] = useState(null);

  const monthKey = getMonthKey(month, year);
  const currentData = allData[monthKey] || {
    privateSessions: 0,
    groupSessions: 0,
    specialEvents: [],
  };

  useEffect(() => {
    const data = allData[monthKey];
    if (
      data &&
      (data.privateSessions > 0 ||
        data.groupSessions > 0 ||
        (data.specialEvents && data.specialEvents.length > 0))
    ) {
      setResult(calculateOffsets(data));
    } else {
      setResult(null);
    }
  }, [monthKey, allData]);

  function handleSave(data) {
    const updated = { ...allData, [monthKey]: data };
    setAllData(updated);
    setResult(calculateOffsets(data));
  }

  return (
    <div className="app">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <Header
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      <main className="main">
        <MonthInput key={monthKey} data={currentData} onSave={handleSave} />

        {result && (
          <div className="results">
            <TransferList transfers={result.transfers} />
            <SummaryCards summaries={result.summaries} />
            <OffsetExplanation steps={result.steps} />
          </div>
        )}
      </main>
    </div>
  );
}
