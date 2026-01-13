import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =========================
   AUTH APIS
========================= */
export const loginApi = (data) => api.post("/auth/login", data);
export const registerApi = (data) => api.post("/auth/register", data);

/* =========================
   USER RESERVATIONS
========================= */
export const getMyReservationsApi = () =>
  api.get("/reservations/my");

export const cancelMyReservationApi = (id) =>
  api.put(`/reservations/${id}/cancel`);

/* =========================
   TABLE AVAILABILITY
========================= */
export const getAvailableTablesApi = (date, timeSlot) =>
  api.get("/reservations/available-tables", {
    params: { date, timeSlot },
  });

export const createReservationApi = (data) =>
  api.post("/reservations", data);

/* =========================
   ADMIN APIS
========================= */
export const getAllReservationsApi = () =>
  api.get("/reservations");

export const getReservationsByDateApi = (date) =>
  api.get(`/reservations/date/${date}`);

export const adminCancelReservationApi = (id) =>
  api.put(`/reservations/${id}/admin-cancel`);

export const adminUpdateReservationApi = (id, data) =>
  api.put(`/reservations/${id}/admin-update`, data);

export default api;
