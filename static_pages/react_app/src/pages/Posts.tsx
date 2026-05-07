import { useEffect, useState } from "react";

export default function TablePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // https://dummyjson.com/products?limit=10
  // https://jsonplaceholder.typicode.com/users

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((json) => {
        setData(json.products || json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <h2>Loading data...</h2>;
  if (data.length === 0) return <h2>No data found</h2>;

  const columns = Array.from(new Set(data.flatMap((row) => Object.keys(row))));

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Dataset Table 📊</h1>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} style={thStyle}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col} style={tdStyle}>
                    {formatValue(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🔥 Smart formatter
function formatValue(value: any) {
  if (!value) return "";

  // If it's an object → format nicely
  if (typeof value === "object") {
    // Handle known structures nicely
    if (value.street && value.city) {
      return `${value.street}, ${value.city}`;
    }

    if (value.name && value.catchPhrase) {
      return `${value.name} (${value.catchPhrase})`;
    }

    // Fallback for any object
    return Object.values(value).join(", ");
  }

  return value;
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  background: "#f0f0f0",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};
