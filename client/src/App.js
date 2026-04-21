import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null);

  // ✅ Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true); // ✅ turn ON loading

    try {
      const res = await axios.post(
        "https://promptcanvas.onrender.com/optimize",
        { prompt: input }
      );

      const aiText = res.data.result;

      // remove loading BEFORE typing animation
      setLoading(false);

      // add empty AI message
      setMessages((prev) => [...prev, { role: "ai", text: "" }]);

      let index = 0;

      const interval = setInterval(() => {
        index++;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = aiText.slice(0, index);
          return updated;
        });

        if (index >= aiText.length) {
          clearInterval(interval);
        }
      }, 15);

    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Error connecting to AI" },
      ]);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2>🎨 PromptCanvas</h2>
        <p>Chat</p>
        <p>Optimize</p>
        <p>Compare</p>
      </div>

      {/* Chat */}
      <div style={styles.chatContainer}>
        <h1>AI Prompt Chat</h1>

        <div style={styles.chatBox}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={
                msg.role === "user"
                  ? styles.userBubble
                  : styles.aiBubble
              }
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.text}
              </ReactMarkdown>  
            </div>
          ))}

          {loading && (
            <div style={styles.aiBubble}>
              ⏳ AI is typing...
            </div>
          )}

          {/* ✅ Auto scroll target */}
          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your prompt..."

            // ✅ Enter key support
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          <button style={styles.sendBtn} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#0f172a",
    color: "white",
  },
  sidebar: {
    width: "220px",
    background: "#1e293b",
    padding: "20px",
  },
  chatContainer: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    marginBottom: "10px",
  },
  userBubble: {
    alignSelf: "flex-end",
    background: "#6366f1",
    padding: "10px",
    borderRadius: "10px",
    margin: "5px",
    maxWidth: "60%",
  },
  aiBubble: {
    alignSelf: "flex-start",
    background: "#1e293b",
    padding: "10px",
    borderRadius: "10px",
    margin: "5px",
    maxWidth: "60%",
    lineHeight: "1.6",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },
  sendBtn: {
    padding: "10px 20px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
};

export default App;