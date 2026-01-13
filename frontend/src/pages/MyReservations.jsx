import { useEffect, useState } from "react";
import axios from "axios";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchReservations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/reservations/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReservations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const cancelReservation = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;

    try {
      await axios.put(
        `http://localhost:5000/api/reservations/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReservations();
    } catch (err) {
      alert("Failed to cancel reservation");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">My Reservations</h1>

        {loading ? (
          <p>Loading...</p>
        ) : reservations.length === 0 ? (
          <p className="text-gray-600">No reservations found.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time Slot</th>
                <th className="p-2 border">Table</th>
                <th className="p-2 border">Seats</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id} className="text-center">
                  <td className="p-2 border">{r.date}</td>
                  <td className="p-2 border">{r.timeSlot}</td>
                  <td className="p-2 border">
                    {r.table?.tableNumber}
                  </td>
                  <td className="p-2 border">
                    {r.table?.capacity}
                  </td>
                  <td className="p-2 border">
                    {r.status}
                  </td>
                  <td className="p-2 border">
                    {r.status === "active" && (
                      <button
                        onClick={() => cancelReservation(r._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
