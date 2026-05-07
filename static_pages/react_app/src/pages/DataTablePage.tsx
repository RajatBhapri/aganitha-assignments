import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";

export default function DataTablePage() {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);


  // https://dummyjson.com/products?limit=10
  // https://jsonplaceholder.typicode.com/users

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((json) => {
        const rows = json.products || json;

        setData(rows);

        const cols = Array.from(
          new Set(rows.flatMap((row: any) => Object.keys(row)))
        ) as string[];

        setColumns(cols);
      });
  }, []);

  useEffect(() => {
    if (!tableRef.current || data.length === 0) return;

    // destroy old instance
    if ($.fn.dataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    // init new instance
    $(tableRef.current).DataTable({
  scrollX: true,
  scrollY: "60vh",   
  paging: true,
});
  }, [data, columns]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dynamic DataTable 🚀</h1>

      <table ref={tableRef} className="display" style={{ width: "100%" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col}>{formatValue(row[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatValue(value: any) {
  if (!value) return "";

  if (typeof value === "object") {
    if (value.street && value.city) {
      return `${value.street}, ${value.city}`;
    }

    if (value.name && value.catchPhrase) {
      return `${value.name} (${value.catchPhrase})`;
    }

    return Object.values(value).join(", ");
  }

  return value;
}

