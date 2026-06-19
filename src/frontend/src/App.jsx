import { useEffect, useRef, useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AppHeader from "./components/AppHeader.jsx";
import DiceInfoWindow from "./components/DiceInfoWindow.jsx";
import CharacterSheetWindow from "./components/CharacterSheetWindow.jsx";

const DICE_SIDES = [4, 6, 8, 10, 12, 20, 100];
const ABILITY_SCORES = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
];

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollDice(count, sides) {
  return Array.from({ length: count }, () => rollDie(sides));
}

function formatModifier(modifier) {
  return modifier >= 0 ? `+ ${modifier}` : `- ${Math.abs(modifier)}`;
}

function getSelectionLabel(kind, count) {
  const noun = count === 1 ? "die" : "dice";

  switch (kind) {
    case "keep-highest":
      return `keep highest ${count} ${noun}`;
    case "keep-lowest":
      return `keep lowest ${count} ${noun}`;
    case "drop-lowest":
      return `drop lowest ${count} ${noun}`;
    case "drop-highest":
      return `drop highest ${count} ${noun}`;
    default:
      return "";
  }
}

function resolveSelection(rolls, selectionKind, selectionCount) {
  if (!selectionKind) {
    return {
      keptRolls: rolls,
      droppedRolls: [],
      selectionLabel: "",
    };
  }

  const count = Math.max(1, selectionCount ?? 1);
  const sortedAsc = [...rolls].sort((a, b) => a.value - b.value || a.index - b.index);
  const sortedDesc = [...sortedAsc].reverse();

  if (count >= rolls.length) {
    return {
      keptRolls: rolls,
      droppedRolls: [],
      selectionLabel: `${getSelectionLabel(selectionKind, count)} (kept all rolls)`,
    };
  }

  switch (selectionKind) {
    case "keep-highest": {
      const keptRolls = sortedDesc.slice(0, count);
      const droppedRolls = sortedAsc.slice(0, rolls.length - count);
      return {
        keptRolls,
        droppedRolls,
        selectionLabel: getSelectionLabel(selectionKind, count),
      };
    }
    case "keep-lowest": {
      const keptRolls = sortedAsc.slice(0, count);
      const droppedRolls = sortedDesc.slice(0, rolls.length - count);
      return {
        keptRolls,
        droppedRolls,
        selectionLabel: getSelectionLabel(selectionKind, count),
      };
    }
    case "drop-lowest": {
      const droppedRolls = sortedAsc.slice(0, count);
      const keptRolls = sortedDesc.slice(0, rolls.length - count);
      return {
        keptRolls,
        droppedRolls,
        selectionLabel: getSelectionLabel(selectionKind, count),
      };
    }
    case "drop-highest": {
      const droppedRolls = sortedDesc.slice(0, count);
      const keptRolls = sortedAsc.slice(0, rolls.length - count);
      return {
        keptRolls,
        droppedRolls,
        selectionLabel: getSelectionLabel(selectionKind, count),
      };
    }
    default:
      return {
        keptRolls: rolls,
        droppedRolls: [],
        selectionLabel: "",
      };
  }
}

function parseRollTerm(term) {
  const cleanedTerm = term.trim().replace(/\s+/g, "");
  const match = cleanedTerm.match(
    /^(\d*)d(\d+)(?:(kh|kl|dh|dl|k|d)(\d*)?)?([+-]\d+)?$/i
  );

  if (!match) {
    throw new Error(`Unsupported dice term: ${term}`);
  }

  const count = Number(match[1] || "1");
  const sides = Number(match[2]);
  const selectionToken = match[3]?.toLowerCase() ?? null;
  const selectionCount = match[4] ? Number(match[4]) : null;
  const modifier = Number(match[5] || "0");

  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`Dice count must be at least 1: ${term}`);
  }

  if (!Number.isInteger(sides) || sides < 1) {
    throw new Error(`Dice sides must be at least 1: ${term}`);
  }

  const rolls = rollDice(count, sides).map((value, index) => ({
    value,
    index,
  }));
  const selectionKind =
    selectionToken === "kh" || selectionToken === "k"
      ? "keep-highest"
      : selectionToken === "kl"
        ? "keep-lowest"
        : selectionToken === "dh"
          ? "drop-highest"
          : selectionToken === "dl" || selectionToken === "d"
            ? "drop-lowest"
            : null;

  const {
    keptRolls,
    droppedRolls,
    selectionLabel,
  } = resolveSelection(rolls, selectionKind, selectionCount);
  const diceTotal = keptRolls.reduce((sum, roll) => sum + roll.value, 0);
  const total = diceTotal + modifier;

  return {
    label: cleanedTerm,
    count,
    sides,
    selectionLabel,
    modifier,
    rolls: rolls.map((roll) => roll.value),
    keptRolls: keptRolls.map((roll) => roll.value),
    droppedRolls: droppedRolls.map((roll) => roll.value),
    total,
  };
}

function parseRollExpression(expression) {
  const compact = expression.replace(/\s+/g, "");

  if (!compact) {
    throw new Error("Try /roll 1d20 or /r 3d6+2.");
  }

  const groups = [];
  let index = 0;

  while (index < compact.length) {
    const termMatch = compact.slice(index).match(
      /^(\d*)d(\d+)(?:(kh|kl|dh|dl|k|d)(\d*)?)?([+-]\d+)?/i
    );

    if (!termMatch) {
      throw new Error(`Unsupported dice expression near "${compact.slice(index)}"`);
    }

    const termText = termMatch[0];
    groups.push(parseRollTerm(termText));
    index += termText.length;

    if (index < compact.length) {
      if (compact[index] !== "+") {
        throw new Error(`Unsupported dice expression near "${compact.slice(index)}"`);
      }

      index += 1;
    }
  }

  const total = groups.reduce((sum, group) => sum + group.total, 0);

  return {
    groups,
    total,
  };
}

function parseLocalCommand(input) {
  const trimmed = input.trim();

  if (/^\/(?:stats|stat|abilityscores?|rollstats?)\b/i.test(trimmed)) {
    return {
      type: "stats",
      command: trimmed,
    };
  }

  const rollMatch = trimmed.match(/^\/(?:r|roll)\b\s*(.*)$/i);

  if (!rollMatch) {
    return null;
  }

  const expression = rollMatch[1].trim();

  if (!expression) {
    throw new Error("Try /roll 1d20, /r 3d6+2, or /roll stats.");
  }

  if (/^stats\b/i.test(expression)) {
    return {
      type: "stats",
      command: trimmed,
    };
  }

  return {
    type: "roll",
    command: trimmed,
    expression,
  };
}

function createStatsRoll(command) {
  const groups = ABILITY_SCORES.map((ability) => {
    const group = parseRollTerm("4d6dl");

    return {
      ...group,
      label: ability,
    };
  });

  const total = groups.reduce((sum, group) => sum + group.total, 0);

  return {
    command,
    groups,
    total,
  };
}

function formatRollResult(roll, title = "Roll command") {
  const lines = [
    `**${title}:** \`${roll.command}\``,
    "",
    ...roll.groups.map(
      (group) => {
        const selectionPart = group.selectionLabel
          ? ` ${group.selectionLabel}`
          : "";
        const keptPart =
          group.keptRolls.length !== group.rolls.length
            ? ` [kept: ${group.keptRolls.join(", ")}]`
            : "";
        const droppedPart = group.droppedRolls.length
          ? ` [dropped: ${group.droppedRolls.join(", ")}]`
          : "";

        return `- \`${group.label}\`: (${group.rolls.join(", ")})${selectionPart}${keptPart}${droppedPart} ${formatModifier(group.modifier)} = ${group.total}`;
      }
    ),
    "",
    `**Total:** ${roll.total}`,
  ];

  return lines.join("\n");
}

function formatStatsResult(roll) {
  const scoreLine = roll.groups.map((group) => group.total).join(", ");
  const lines = [
    `**Ability score roll:** \`${roll.command}\``,
    "",
    ...roll.groups.map(
      (group, index) =>
        `- **${ABILITY_SCORES[index]}**: (${group.rolls.join(", ")}) ${group.selectionLabel} [kept: ${group.keptRolls.join(", ")}] [dropped: ${group.droppedRolls.join(", ")}] = ${group.total}`
    ),
    "",
    `**Scores:** ${scoreLine}`,
    `**Total:** ${roll.total}`,
  ];

  return lines.join("\n");
}

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [diceOpen, setDiceOpen] = useState(false);
  const [diceInfoOpen, setDiceInfoOpen] = useState(false);
  const [characterSheetOpen, setCharacterSheetOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!characterSheetOpen && !diceInfoOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDiceInfoOpen(false);
        setCharacterSheetOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [characterSheetOpen, diceInfoOpen]);

  const pushConversation = (userContent, assistantContent) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userContent },
      { role: "assistant", content: assistantContent },
    ]);
  };

  const handleDiceRoll = (sides) => {
    const command = `/roll 1d${sides}`;
    const roll = parseRollExpression(`1d${sides}`);

    pushConversation(command, formatRollResult({ command, ...roll }));

    setDiceOpen(false);
  };

  const openCharacterSheet = () => {
    setCharacterSheetOpen(true);
  };

  const closeCharacterSheet = () => {
    setCharacterSheetOpen(false);
  };

  const openDiceInfo = () => {
    setDiceInfoOpen(true);
  };

  const closeDiceInfo = () => {
    setDiceInfoOpen(false);
  };

  const sendQuestion = async (event) => {
    event.preventDefault();

    const currentQuestion = question.trim();

    if (!currentQuestion) {
      return;
    }

    try {
      const localCommand = parseLocalCommand(currentQuestion);

      if (localCommand?.type === "stats") {
        const statsRoll = createStatsRoll(localCommand.command);
        pushConversation(currentQuestion, formatStatsResult(statsRoll));
        setQuestion("");
        setDiceOpen(false);
        return;
      }

      if (localCommand?.type === "roll") {
        const roll = parseRollExpression(localCommand.expression);
        pushConversation(
          currentQuestion,
          formatRollResult({
            command: localCommand.command,
            ...roll,
          })
        );
        setQuestion("");
        setDiceOpen(false);
        return;
      }
    } catch {
      pushConversation(
        currentQuestion,
        "I could not parse that roll. Try `/roll 3d6+2`, `/roll 2d20kh + 2`, or `/roll stats`."
      );
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error contacting RAG server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <AppHeader
        onOpenCharacterSheet={openCharacterSheet}
        onOpenInfo={openDiceInfo}
      />

      <main className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}

        {loading && <div className="message assistant">Consulting the archives...</div>}
        <div ref={chatEndRef} />
      </main>

      <form className="composer" onSubmit={sendQuestion}>
        <div className="composer-row">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about D&D or type /roll 1d20..."
            aria-label="Chat input"
          />

          <button type="submit">Ask</button>

          <button
            type="button"
            className="dice-button"
            onClick={() => setDiceOpen((prev) => !prev)}
            aria-expanded={diceOpen}
            aria-label="Open dice roller"
          >
            Dice
          </button>
        </div>

        {diceOpen && (
          <div className="dice-menu" role="group" aria-label="Quick dice rolls">
            {DICE_SIDES.map((sides) => (
              <button
                key={sides}
                type="button"
                className="dice-chip"
                onClick={() => handleDiceRoll(sides)}
              >
                d{sides}
              </button>
            ))}
          </div>
        )}

        <p className="composer-hint">
          Quick commands: <code>/roll stats</code>, <code>/r 3d6+2</code>,{" "}
          <code>/roll 2d20kh + 2</code>, or <code>/roll 2d6+5 + 1d8</code>.
        </p>
      </form>

      <CharacterSheetWindow
        open={characterSheetOpen}
        onClose={closeCharacterSheet}
      />

      <DiceInfoWindow open={diceInfoOpen} onClose={closeDiceInfo} />
    </div>
  );
}

export default App;
