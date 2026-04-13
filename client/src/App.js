import { useState } from "react";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("optimize");
  const [promptA, setPromptA] = useState("");
  const [promptB, setPromptB] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert("Copied!");
  };

  const handleOptimize = async () => {
   let finalPrompt = "";

   if (mode === "optimize") {
    finalPrompt = prompt;
    }

    if (mode === "generate") {
      finalPrompt = `Create a detailed prompt for: ${prompt}`;
    }

    if (mode === "compare") {
      finalPrompt = `
  Compare these two prompts and tell which is better and why:

  Prompt A: ${promptA}

  Prompt B: ${promptB}
  `;
    }

    try {
      // 🔥 Show loading
      setResult("Loading... ⏳");

      const res = await axios.post(
        "https://promptcanvas.onrender.com/optimize",
        { prompt: finalPrompt }
      );

      setResult(res.data.result);

    } 
      catch (err) {
        console.error("FULL ERROR:", err);

        setResult(
          "❌ " + (err.response?.data?.error || err.message)
        );
      }
 };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2>🎨 PromptCanvas</h2>
        <p>Canvas</p>
        <p>Optimize</p>
        <p>Compare</p>
        <p>My Prompts</p>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <h1>Design Your Prompt</h1>

        <div style={styles.tabs}>
          <button onClick={() => setMode("optimize")}>Optimize</button>
          <button onClick={() => setMode("generate")}>Generate</button>
          <button onClick={() => setMode("compare")}>Compare</button>
        </div>

        {mode === "compare" ? (
          <>
            <textarea
              style={styles.textarea}
              placeholder="Enter Prompt A..."
              value={promptA}
              onChange={(e) => setPromptA(e.target.value)}
            />

            <textarea
              style={styles.textarea}
              placeholder="Enter Prompt B..."
              value={promptB}
              onChange={(e) => setPromptB(e.target.value)}
            />
          </>
        ) : (
          <textarea
            style={styles.textarea}
            placeholder="Write your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        )}

        <div style={styles.tabs}>
          <button
            style={mode === "optimize" ? styles.activeTab : styles.tab}
            onClick={() => setMode("optimize")}
          >
           Optimize
          </button>

          <button
            style={mode === "generate" ? styles.activeTab : styles.tab}
            onClick={() => setMode("generate")}
          >
           Generate
          </button>

          <button
            style={mode === "compare" ? styles.activeTab : styles.tab}
            onClick={() => setMode("compare")}
          >
           Compare
          </button>
        </div>

        <button style={styles.button} onClick={handleOptimize}>
          {mode === "optimize" && "Optimize Prompt"}
          {mode === "generate" && "Generate Prompt"}
          {mode === "compare" && "Compare Prompts"}
        </button>

        <div style={styles.output}>
         <div style={{ display: "flex", justifyContent: "space-between" }}>
           <h3>Result:</h3>
           <button style={styles.copyBtn} onClick={handleCopy}>
             Copy
           </button>
         </div>
         <p>{result}</p>
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
  main: {
    flex: 1,
    padding: "30px",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    marginTop: "20px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#6366f1",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  output: {
    marginTop: "30px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
  },
  copyBtn: {
    background: "#22c55e",
    border: "none",
    padding: "5px 10px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  tab: {
    padding: "8px 15px",
    background: "#334155",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  activeTab: {
    padding: "8px 15px",
    background: "#6366f1",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};

export default App;