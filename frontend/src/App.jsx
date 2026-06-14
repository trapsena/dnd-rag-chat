import { useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = question;
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: currentQuestion,
          }),
        }
      );

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
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <div className="title">
        Dungeons & Dragons RAG Assistant
      </div>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
                key={index}
                className={`message ${msg.role}`}
                >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                >
                    {msg.content}
                </ReactMarkdown>
        </div>
        ))}

        {loading && (
          <div className="message assistant">
            Consulting the archives...
          </div>
        )}
      </div>

      <div className="input-bar">
        <input
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Ask about D&D..."
        />

        <button onClick={sendQuestion}>
          Ask
        </button>
      </div>
    </div>
  );
        
}

export default App;