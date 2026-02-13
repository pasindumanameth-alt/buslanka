import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../api";
import ResultCard from "../components/ResultCard";
import "../styles/results.css";

function useQuery() { return new URLSearchParams(useLocation().search); }

export default function ResultsPage() {
  const q = useQuery();
  const navigate = useNavigate();
  const from = q.get("from");
  const to = q.get("to");
  const date = q.get("date");

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        const res = await fetch(ENDPOINTS.searchTrips(from, to, date));
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load");
        const trips = data.trips || [];
        setRows(trips);
        setMsg(trips.length ? "" : (data.message || "No bus available for this route and the date"));
      } catch (e) {
        setRows([]);
        setMsg(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (from && to && date) run();
  }, [from, to, date]);

  const pick = (t) => navigate(`/select-seat/${t._id}`);

  return (
    <div className="results-wrap">
      <h2>Available Buses</h2>
      <p className="sub">{from} → {to} on {date}</p>
      {loading && <p>Loading…</p>}
      {!loading && rows.length > 0 && rows.map(t => (
        <ResultCard key={t._id} trip={t} onPick={() => pick(t)} />
      ))}
      {!loading && rows.length === 0 && (
        <div className="empty">
          <div className="empty-title">No Results</div>
          <div className="empty-sub">{msg}</div>
        </div>
      )}
    </div>
  );
}