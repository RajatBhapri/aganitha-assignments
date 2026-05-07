import { useEffect, useState } from "react";

export default function ApiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>API Data 📡</h1>
      <p><strong>Title:</strong> {data.title}</p>
      <p><strong>Body:</strong> {data.body}</p>
    </div>
  );
}