function AppHeader({ onOpenCharacterSheet, onOpenInfo }) {
  return (
    <header className="title">
      <div>
        <p className="eyebrow">Dungeons & Dragons RAG Assistant</p>
        <h1>Ask the archives</h1>
      </div>
      <div className="title-copy">
        <p className="subtitle">
          Use the chat for lore and rules, or type <code>/roll stats</code>{" "}
          for ability scores and <code>/roll 3d6+2</code> for local dice
          rolls.
        </p>
        <div className="title-actions">
          <button
            type="button"
            className="header-button header-button--info"
            onClick={onOpenInfo}
          >
            Info
          </button>
          <button
            type="button"
            className="header-button"
            onClick={onOpenCharacterSheet}
          >
            Character
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
