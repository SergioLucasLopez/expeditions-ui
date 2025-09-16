import { useEffect, useState } from "react";

const API = "http://localhost:8080";

export default function App() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderId, setOrderId] = useState("");
  const [palletId, setPalletId] = useState("");
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/orders/open`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setOrders(data);
        // Selecciona la primera orden por defecto
        if (data.length) setOrderId(String(data[0].id));
      } catch {
        setError("No se pudieron cargar las órdenes.");
      } finally {
        setLoadingOrders(false);
      }
    };
    load();
  }, []);

  const assign = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!palletId || !orderId) {
      setError("Debes indicar id de palet y seleccionar una orden.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API}/api/assignments/pallet-to-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          palletId: Number(palletId),
          orderId: Number(orderId),
        }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      if (!res.ok) {
        setError(typeof data === "string" ? data : "Operación inválida.");
      } else {
        setResult(data);
      }
    } catch {
      setError("No se pudo contactar con el servidor.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>Asignar palet a orden</h1>

      <form onSubmit={assign} style={styles.card}>
        <label style={styles.label}>Orden de carga</label>
        {loadingOrders ? (
          <div>Cargando órdenes…</div>
        ) : orders.length === 0 ? (
          <div>No hay órdenes abiertas.</div>
        ) : (
          <select
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={styles.input}
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.codigo} – Camión: {o.truckPlate ?? "sin camión"}
              </option>
            ))}
          </select>
        )}

        <label style={styles.label}>Id de palet</label>
        <input
          type="number"
          placeholder="Ej: 100"
          value={palletId}
          onChange={(e) => setPalletId(e.target.value)}
          style={styles.input}
        />

        <button type="submit" disabled={sending || loadingOrders || !orders.length} style={styles.btn}>
          {sending ? "Asignando..." : "Asignar palet"}
        </button>
      </form>

      {error && <div style={{ ...styles.alert, background: "#ffe4e6", color: "#991b1b" }}>{error}</div>}

      {result && (
        <div style={{ ...styles.alert, background: "#ecfeff", color: "#155e75" }}>
          <strong>OK</strong>
          <pre style={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#8b1c55", // fondo morado
    padding: 20,
  },
  title: {
    color: "white",
    marginBottom: 24,
    fontFamily: "system-ui, sans-serif",
    textAlign: "center",
  },
  card: {
    width: 360,
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,.25)",
    display: "grid",
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: "#334155",
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    outline: "none",
  },
  btn: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#0ea5e9",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
  alert: {
    width: 360,
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: 13,
    textAlign: "center",
  },
  pre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};
