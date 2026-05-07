import { useEffect, useState } from "react";

export default function ApiPage() {
  const [setup, setSetup] = useState("");
  const [punchline, setPunchline] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJoke = () => {
    setLoading(true);

    fetch("https://official-joke-api.appspot.com/random_joke")
      .then((res) => res.json())
      .then((data) => {
        setSetup(data.setup);
        setPunchline(data.punchline);
      })
      .catch(() => {
        setSetup("Failed to load joke 😢");
        setPunchline("");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>😂 Joke Generator</h1>

        <div style={styles.jokeBox}>
          {loading ? (
            <p style={styles.loading}>Loading...</p>
          ) : (
            <>
              <p style={styles.setup}>{setup}</p>
              <p style={styles.punchline}>{punchline}</p>
            </>
          )}
        </div>

        <button style={styles.button} onClick={fetchJoke}>
          🔄 New Joke
        </button>
      </div>
    </div>
  );
}

// ✅ More spacing + bigger layout
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "40px", // 👈 more padding
    borderRadius: "20px",
    width: "500px", // 👈 wider
    minHeight: "320px", // 👈 more height
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
  },
  title: {
    marginBottom: "25px",
    fontSize: "1.8rem",
    color: "#4f46e5",
  },
  jokeBox: {
    marginBottom: "30px",
    padding: "20px",
    background: "#f9fafb",
    borderRadius: "12px",
    lineHeight: "1.8", // 👈 more readable spacing
  },
  setup: {
    fontSize: "1.2rem", // 👈 bigger text
    marginBottom: "18px",
    color: "#333",
  },
  punchline: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#4f46e5",
  },
  loading: {
    fontSize: "1.1rem",
    color: "#999",
  },
  button: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "10px",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
  },
};