import { useEffect, useRef, useState } from "react";

const MIN_WIDTH = 320;
const MIN_HEIGHT = 420;
const EDGE = 10;

function getCenteredRect() {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1280;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 900;

  const width = Math.min(
    Math.max(280, viewportWidth - 24),
    Math.max(MIN_WIDTH, Math.round(viewportWidth * 0.72))
  );
  const height = Math.min(
    Math.max(360, viewportHeight - 24),
    Math.max(MIN_HEIGHT, Math.round(viewportHeight * 0.78))
  );

  return {
    x: Math.max(12, Math.round((viewportWidth - width) / 2)),
    y: Math.max(12, Math.round((viewportHeight - height) / 2)),
    width,
    height,
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function CharacterSheetWindow({ open, onClose }) {
  const [rect, setRect] = useState(() => getCenteredRect());
  const rectRef = useRef(rect);
  const interactionRef = useRef(null);

  useEffect(() => {
    rectRef.current = rect;
  }, [rect]);

  useEffect(() => {
    if (open) {
      setRect(getCenteredRect());
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const finishInteraction = () => {
      const interaction = interactionRef.current;

      if (interaction?.element?.releasePointerCapture && interaction.pointerId != null) {
        try {
          interaction.element.releasePointerCapture(interaction.pointerId);
        } catch {
          // Ignore capture-release errors and still clear the interaction state.
        }
      }

      interactionRef.current = null;
      document.body.style.userSelect = "";
    };

    const resizeFromHandle = (nextRect, handle, dx, dy, viewportWidth, viewportHeight) => {
      let { x, y, width, height } = nextRect;
      const moveLeft = handle.includes("w");
      const moveRight = handle.includes("e");
      const moveTop = handle.includes("n");
      const moveBottom = handle.includes("s");

      if (moveLeft) {
        x += dx;
        width -= dx;
      }

      if (moveRight) {
        width += dx;
      }

      if (moveTop) {
        y += dy;
        height -= dy;
      }

      if (moveBottom) {
        height += dy;
      }

      if (width < MIN_WIDTH) {
        if (moveLeft && !moveRight) {
          x -= MIN_WIDTH - width;
        }

        width = MIN_WIDTH;
      }

      if (height < MIN_HEIGHT) {
        if (moveTop && !moveBottom) {
          y -= MIN_HEIGHT - height;
        }

        height = MIN_HEIGHT;
      }

      const maxX = Math.max(8, viewportWidth - width - 8);
      const maxY = Math.max(8, viewportHeight - height - 8);
      x = clamp(x, 8, maxX);
      y = clamp(y, 8, maxY);

      if (x + width > viewportWidth - 8) {
        width = viewportWidth - 8 - x;
      }

      if (y + height > viewportHeight - 8) {
        height = viewportHeight - 8 - y;
      }

      return { x, y, width, height };
    };

    const onPointerMove = (event) => {
      const interaction = interactionRef.current;

      if (!interaction) {
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dx = event.clientX - interaction.startX;
      const dy = event.clientY - interaction.startY;

      if (interaction.type === "drag") {
        const width = interaction.origin.width;
        const height = interaction.origin.height;
        const x = clamp(interaction.origin.x + dx, 8, Math.max(8, viewportWidth - width - 8));
        const y = clamp(interaction.origin.y + dy, 8, Math.max(8, viewportHeight - height - 8));

        setRect((current) => ({
          ...current,
          x,
          y,
        }));
        return;
      }

      if (interaction.type === "resize") {
        const nextRect = resizeFromHandle(
          interaction.origin,
          interaction.handle,
          dx,
          dy,
          viewportWidth,
          viewportHeight
        );

        setRect(nextRect);
      }
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", finishInteraction);
    document.addEventListener("pointercancel", finishInteraction);
    window.addEventListener("blur", finishInteraction);

    return () => {
      finishInteraction();
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", finishInteraction);
      document.removeEventListener("pointercancel", finishInteraction);
      window.removeEventListener("blur", finishInteraction);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const startDrag = (event) => {
    if (event.button !== 0) {
      return;
    }

    if (event.target.closest("button")) {
      return;
    }

    interactionRef.current = {
      type: "drag",
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...rectRef.current },
      pointerId: event.pointerId,
      element: event.currentTarget,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    document.body.style.userSelect = "none";
  };

  const startResize = (event, handle) => {
    event.preventDefault();
    event.stopPropagation();

    interactionRef.current = {
      type: "resize",
      handle,
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...rectRef.current },
      pointerId: event.pointerId,
      element: event.currentTarget,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    document.body.style.userSelect = "none";
  };

  const handles = [
    ["nw", "sheet-window__handle sheet-window__handle--nw"],
    ["n", "sheet-window__handle sheet-window__handle--n"],
    ["ne", "sheet-window__handle sheet-window__handle--ne"],
    ["e", "sheet-window__handle sheet-window__handle--e"],
    ["se", "sheet-window__handle sheet-window__handle--se"],
    ["s", "sheet-window__handle sheet-window__handle--s"],
    ["sw", "sheet-window__handle sheet-window__handle--sw"],
    ["w", "sheet-window__handle sheet-window__handle--w"],
  ];

  return (
    <div className="sheet-overlay" role="presentation">
      <section
        className="sheet-window"
        role="dialog"
        aria-modal="false"
        aria-labelledby="character-sheet-title"
        style={{
          left: `${rect.x}px`,
          top: `${rect.y}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        }}
      >
        <div className="sheet-window__chrome" onPointerDown={startDrag}>
          <div>
            <p className="sheet-window__eyebrow">Window</p>
            <h2 id="character-sheet-title">Character</h2>
          </div>

          <button type="button" className="sheet-window__close" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="sheet-window__meta">
          This loads the standalone 5e character sheet bundle inside the chat
          app, so you can keep the sheet open while you ask the RAG assistant
          questions.
        </p>

        <iframe
          className="sheet-window__frame"
          src="./character-sheet/index.html"
          title="Dungeons & Dragons character sheet"
        />

        {handles.map(([handle, className]) => (
          <button
            key={handle}
            type="button"
            className={className}
            aria-label={`Resize character sheet ${handle}`}
            onPointerDown={(event) => startResize(event, handle)}
          />
        ))}
      </section>
    </div>
  );
}

export default CharacterSheetWindow;
