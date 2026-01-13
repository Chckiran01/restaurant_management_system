import { useEffect, useState } from "react";
import axios from "axios";

const TIME_SLOTS = [
  "12:00-14:00",
  "14:00-16:00",
  "18:00-20:00",
  "20:00-22:00",
];

// Capacity → color mapping (same idea as cinema seats)
const capacityColor = {
  2: "bg-blue-600",
  4: "bg-green-600",
  6: "bg-yellow-500",
  10: "bg-red-600",
};

export default function UserDashboard() {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [tables, setTables] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  /* =========================
     FETCH AVAILABLE TABLES
  ========================= */
  const fetchTables = async () => {
    if (!date || !timeSlot) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/api/reservations/available-tables",
        {
          params: { date, timeSlot },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTables(res.data);
    } catch (err) {
      console.error(err);
      setTables([]);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [date, timeSlot]);

  /* =========================
     BOOK TABLE
  ========================= */
  const bookTable = async (table) => {
    if (!window.confirm(`Book Table #${table.tableNumber}?`)) return;

    try {
      await axios.post(
        "http://localhost:5000/api/reservations",
        {
          date,
          timeSlot,
          guests: table.capacity,
          tableId: table._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(
        `Table #${table.tableNumber} (${table.capacity} seats) booked successfully`
      );

      fetchTables();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Reserve a Table
        </h1>

        {/* DATE */}
        <label className="block mb-2 font-semibold">
          Select Date
        </label>
        <input
          type="date"
          className="text-black p-2 rounded mb-6"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* TIME SLOT */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              onClick={() => setTimeSlot(slot)}
              className={`px-4 py-2 rounded ${
                timeSlot === slot
                  ? "bg-green-600"
                  : "bg-gray-700"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* LEGEND */}
        <div className="mb-6 text-sm">
          <p className="font-semibold mb-2">Legend</p>
          <div className="flex gap-4 flex-wrap">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-600 rounded"></span> 2 Seater
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-600 rounded"></span> 4 Seater
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-500 rounded"></span> 6 Seater
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-600 rounded"></span> 10 Seater
            </span>
          </div>
        </div>

        {/* TABLE GRID */}
        {!date || !timeSlot ? (
          <p className="text-gray-400">
            Select date & time slot to view tables
          </p>
        ) : tables.length === 0 ? (
          <p className="text-red-400">
            No tables available for selected slot
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {tables.map((table) => (
              <div
                key={table._id}
                onClick={() => bookTable(table)}
                className={`cursor-pointer rounded-lg p-4 text-center shadow-lg transition hover:scale-105 ${
                  capacityColor[table.capacity] || "bg-gray-600"
                }`}
              >
                <h3 className="text-lg font-bold">
                  Table #{table.tableNumber}
                </h3>
                <p className="mt-1">
                  {table.capacity} Seater
                </p>
                <p className="text-sm mt-2 text-white/80">
                  Available
                </p>
              </div>
            ))}
          </div>
        )}

        {/* MESSAGE */}
        {message && (
          <p className="mt-8 text-green-400 font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
