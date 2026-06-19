function DiceInfoWindow({ open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="sheet-overlay dice-info-overlay" role="presentation">
      <section
        className="sheet-window dice-info-window"
        role="dialog"
        aria-modal="false"
        aria-labelledby="dice-info-title"
      >
        <div className="sheet-window__chrome">
          <div>
            <p className="sheet-window__eyebrow">Reference</p>
            <h2 id="dice-info-title">Dice Commands</h2>
          </div>

          <button type="button" className="sheet-window__close" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="dice-info-window__body">
          <p className="sheet-window__meta">
            These commands run locally in the chat and do not send a request to
            the RAG API.
          </p>

          <section className="dice-info-section">
            <h3>Core commands</h3>
            <ul>
              <li>
                <code>/r 3d6+2</code> or <code>/roll 3d6+2</code>
              </li>
              <li>
                <code>/roll 2d6+5 + 1d8</code> for multiple grouped rolls
              </li>
              <li>
                <code>/roll stats</code> for six ability scores using 4d6 drop
                lowest
              </li>
            </ul>
          </section>

          <section className="dice-info-section">
            <h3>Keep and drop modifiers</h3>
            <ul>
              <li>
                <code>kh</code> or <code>k</code>: keep highest
              </li>
              <li>
                <code>kl</code>: keep lowest
              </li>
              <li>
                <code>dl</code> or <code>d</code>: drop lowest
              </li>
              <li>
                <code>dh</code>: drop highest
              </li>
            </ul>
            <p>
              Examples: <code>/roll 3d10k</code>,{" "}
              <code>/roll 4d6k3</code>, <code>/roll 2d20kh + 2</code>,{" "}
              <code>/roll 4d6kl3</code>, and <code>/roll 2d20kl + 5</code>.
            </p>
          </section>

          <section className="dice-info-section">
            <h3>Combat rolls</h3>
            <p>
              For a sword attack using Strength stat, roll{" "}
              <code>1d20 + Strength modifier (+3) + Proficiency bonus (+2)</code>.
            </p>
          </section>

          <section className="dice-info-section">
            <h3>Spell guidance</h3>
            <p>
              For spells, look up and read how a spell works before making
              rolls. Check the spell’s range, targets, casting time, duration,
              and any saving throw or attack roll requirements first.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}

export default DiceInfoWindow;
