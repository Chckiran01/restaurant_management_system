import { useEffect, useState } from "react";

import {
  getAllReservationsApi,
  getReservationsByDateApi,
  getAvailableTablesApi,
  adminCancelReservationApi,
  adminUpdateReservationApi,
} from "../services/api";

const TIME_SLOTS = [
  "12:00-14:00",
  "14:00-16:00",
  "18:00-20:00",
  "20:00-22:00",
];

export default function AdminDashboard() {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);

  const [editingReservation, setEditingReservation] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);

  /* ============================
     FETCH RESERVATIONS
  ============================ */
  const fetchReservations = async () => {
    try {
      const res = date
        ? await getReservationsByDateApi(date)
        : await getAllReservationsApi();

      setReservations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ============================
     FETCH AVAILABLE TABLES (VIEW)
  ============================ */
  const fetchTables = async () => {
    if (!date || !timeSlot) return;

    const res = await getAvailableTablesApi(date, timeSlot);
    setTables(res.data);
  };

  /* ============================
     FETCH TABLES FOR UPDATE MODAL
  ============================ */
  const fetchAvailableTablesForEdit = async (date, timeSlot) => {
    const res = await getAvailableTablesApi(date, timeSlot);
    setAvailableTables(res.data);
  };

  useEffect(() => {
    fetchReservations();
  }, [date]);

  useEffect(() => {
    fetchTables();
  }, [date, timeSlot]);

  /* ============================
     CANCEL RESERVATION
  ============================ */
  const cancelReservation = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;

    await adminCancelReservationApi(id);
    fetchReservations();
  };

  /* ============================
     SAVE UPDATED RESERVATION
  ============================ */
  const saveUpdate = async () => {
    await adminUpdateReservationApi(editingReservation._id, {
      date: editingReservation.date,
      timeSlot: editingReservation.timeSlot,
      tableId: editingReservation.table._id,
    });

    setEditingReservation(null);
    fetchReservations();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Admin Dashboard
        </h1>

        {/* DATE FILTER */}
        <label className="block mb-2 font-semibold">
          Filter by Date
        </label>
        <input
          type="date"
          className="text-black p-2 rounded mb-6"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* TIME SLOT FILTER */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              onClick={() => setTimeSlot(slot)}
              className={`px-4 py-2 rounded ${
                timeSlot === slot
                  ? "bg-red-600"
                  : "bg-gray-700"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* AVAILABLE TABLES */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Available Tables
          </h2>

          {tables.length === 0 ? (
            <p className="text-gray-400">
              Select date & time slot
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className="border border-green-500 p-4 rounded text-center"
                >
                  <p className="font-bold">
                    Table #{table.tableNumber}
                  </p>
                  <p>{table.capacity} seats</p>
                  <p className="text-green-400 mt-1">
                    Available
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RESERVATIONS TABLE */}
        <h2 className="text-xl font-semibold mb-4">
          All Reservations
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th>User</th>
                <th>Date</th>
                <th>Time</th>
                <th>Table</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((r) => (
                <tr
                  key={r._id}
                  className="text-center border-t border-gray-700"
                >
                  <td className="p-2">{r.user?.email}</td>
                  <td>{r.date}</td>
                  <td>{r.timeSlot}</td>
                  <td>{r.table?.tableNumber}</td>
                  <td>{r.table?.capacity}</td>
                  <td
                    className={
                      r.status === "active"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {r.status}
                  </td>
                  <td className="space-x-2">
                    {r.status === "active" && (
                      <>
                        <button
                          onClick={() => {
                            setEditingReservation(r);
                            fetchAvailableTablesForEdit(
                              r.date,
                              r.timeSlot
                            );
                          }}
                          className="bg-blue-600 px-3 py-1 rounded"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => cancelReservation(r._id)}
                          className="bg-red-600 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ======================
           UPDATE MODAL POPUP
        ====================== */}
        {editingReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg w-full max-w-md p-6 relative">

              <button
                onClick={() => setEditingReservation(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold mb-4">
                Update Reservation
              </h3>

              <label className="font-semibold block mb-1">Date</label>
              <input
                type="date"
                className="border p-2 rounded w-full mb-3"
                value={editingReservation.date}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    date: e.target.value,
                  })
                }
              />

              <label className="font-semibold block mb-1">Time Slot</label>
              <select
                className="border p-2 rounded w-full mb-3"
                value={editingReservation.timeSlot}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    timeSlot: e.target.value,
                  })
                }
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>

              <label className="font-semibold block mb-1">Table</label>
              <select
                className="border p-2 rounded w-full mb-4"
                value={editingReservation.table._id}
                onChange={(e) =>
                  setEditingReservation({
                    ...editingReservation,
                    table: { _id: e.target.value },
                  })
                }
              >
                {availableTables.map((t) => (
                  <option key={t._id} value={t._id}>
                    Table #{t.tableNumber} ({t.capacity} seats)
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingReservation(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  onClick={saveUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
