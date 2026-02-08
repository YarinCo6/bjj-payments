const PRIVATE_SESSION_RATE = 50;
const GROUP_SESSION_RATE = 150;
const YARIN_TO_GADI_MONTHLY = 350;

export function calculateOffsets(data) {
  const {
    privateSessions = 0,
    groupSessions = 0,
    specialEvents = [],
  } = data;

  const numPrivate = Number(privateSessions) || 0;
  const numGroup = Number(groupSessions) || 0;

  // Step 1: Yarin owes Omar for rent (private sessions)
  const yarinOwesOmar = numPrivate * PRIVATE_SESSION_RATE;

  // Step 2: Omar owes Yarin for group sessions
  const omarOwesYarin = numGroup * GROUP_SESSION_RATE;

  // Step 3: Special events - Yarin paid for Omar
  const validEvents = specialEvents.filter(
    (ev) => ev && ev.description && Number(ev.amount) > 0
  );
  const totalSpecialEvents = validEvents.reduce(
    (sum, ev) => sum + Number(ev.amount),
    0
  );

  // Step 4: Net between Yarin and Omar
  // Positive = Omar owes Yarin, Negative = Yarin owes Omar
  const netYarinOmar = omarOwesYarin - yarinOwesOmar + totalSpecialEvents;

  const steps = [];
  const transfers = [];

  // --- Build explanation steps ---

  if (numPrivate > 0) {
    steps.push({
      text: `ירין העביר ${numPrivate} אימונים פרטיים × ₪${PRIVATE_SESSION_RATE} = שכירות של ₪${yarinOwesOmar} לעומר`,
    });
  }

  if (numGroup > 0) {
    steps.push({
      text: `ירין העביר ${numGroup} אימונים קבוצתיים × ₪${GROUP_SESSION_RATE} = ₪${omarOwesYarin} שעומר חייב לירין`,
    });
  }

  if (validEvents.length > 0) {
    const eventsText = validEvents
      .map((ev) => `${ev.description}: ₪${ev.amount}`)
      .join(', ');
    steps.push({
      text: `אירועים מיוחדים שירין שילם על עומר: ${eventsText} (סה"כ ₪${totalSpecialEvents}) — עומר חייב לירין את הסכום הזה`,
    });
  }

  // Build net explanation
  const netParts = [];
  if (omarOwesYarin > 0) netParts.push(`₪${omarOwesYarin} אימונים קבוצתיים`);
  if (totalSpecialEvents > 0) netParts.push(`₪${totalSpecialEvents} אירועים מיוחדים`);
  const netReceivable = netParts.length > 0 ? netParts.join(' + ') : '₪0';

  const netPayable = yarinOwesOmar > 0 ? `₪${yarinOwesOmar} שכירות` : '₪0';

  // Summary for each person
  const omerSummary = { receives: 0, pays: 0, details: [] };
  const gadiSummary = { receives: 0, pays: 0, details: [] };
  const yarinSummary = { receives: 0, pays: 0, details: [] };

  if (netYarinOmar > 0) {
    // Omar owes Yarin → offset through Gadi's rent
    steps.push({
      text: `נטו: עומר חייב לירין ₪${netYarinOmar} (${netReceivable} - ${netPayable})`,
    });

    steps.push({
      text: `עומר מקזז ₪${netYarinOmar} מהשכירות של גדי — גדי מעביר ₪${netYarinOmar} לירין במקום לעומר`,
    });

    // Gadi transfers to Yarin (instead of paying Omar that amount)
    transfers.push({
      from: 'גדי',
      to: 'ירין',
      amount: netYarinOmar,
      reason: `קיזוז מהשכירות של גדי (עומר חייב לירין ₪${netYarinOmar})`,
    });

    gadiSummary.pays += netYarinOmar;
    gadiSummary.details.push(`₪${netYarinOmar} לירין (קיזוז שכירות מעומר)`);

    yarinSummary.receives += netYarinOmar;
    yarinSummary.details.push(`₪${netYarinOmar} מגדי (קיזוז מעומר)`);

    omerSummary.details.push(`קוזז ₪${netYarinOmar} מהשכירות של גדי`);
  } else if (netYarinOmar < 0) {
    const yarinPaysOmar = Math.abs(netYarinOmar);
    steps.push({
      text: `נטו: ירין חייב לעומר ₪${yarinPaysOmar} (${netPayable} - ${netReceivable})`,
    });

    transfers.push({
      from: 'ירין',
      to: 'עומר',
      amount: yarinPaysOmar,
      reason: `יתרת חוב לאחר קיזוז אימונים${totalSpecialEvents > 0 ? ' ואירועים מיוחדים' : ''}`,
    });

    yarinSummary.pays += yarinPaysOmar;
    yarinSummary.details.push(`₪${yarinPaysOmar} לעומר (יתרת שכירות)`);

    omerSummary.receives += yarinPaysOmar;
    omerSummary.details.push(`₪${yarinPaysOmar} מירין (יתרת שכירות)`);
  } else {
    steps.push({
      text: `נטו: ירין ועומר מתקזזים בדיוק — אין העברה ביניהם`,
    });
  }

  // Yarin always pays Gadi monthly
  transfers.push({
    from: 'ירין',
    to: 'גדי',
    amount: YARIN_TO_GADI_MONTHLY,
    reason: 'תשלום חודשי קבוע',
  });

  yarinSummary.pays += YARIN_TO_GADI_MONTHLY;
  yarinSummary.details.push(`₪${YARIN_TO_GADI_MONTHLY} לגדי (תשלום חודשי)`);

  gadiSummary.receives += YARIN_TO_GADI_MONTHLY;
  gadiSummary.details.push(`₪${YARIN_TO_GADI_MONTHLY} מירין (תשלום חודשי)`);

  steps.push({
    text: `ירין משלם לגדי ₪${YARIN_TO_GADI_MONTHLY} תשלום חודשי קבוע`,
  });

  return {
    steps,
    transfers,
    summaries: {
      omer: omerSummary,
      gadi: gadiSummary,
      yarin: yarinSummary,
    },
    raw: {
      yarinOwesOmar,
      omarOwesYarin,
      totalSpecialEvents,
      netYarinOmar,
    },
  };
}
