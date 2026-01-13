import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleBook = () => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/reserve"); // SAME for admin & user
    }
  };

  return (
    <section
      className="h-screen bg-cover bg-center flex items-center justify-center rounded-md"
      style={{ backgroundImage: "url('/restaurant1.jpg')" }}
    >
      <div className="bg-black bg-opacity-60 p-10  text-white text-center rounded">
        <h1 className="text-4xl font-bold mb-4">
          Vibe  Restaurant
        </h1>
        <p className="mb-6">
          Reserve your table easily
        </p>
        <button
          onClick={handleBook}
          className="bg-green-600 px-6 py-3 rounded hover:bg-green-700 transition"
        >
          Book a Table
        </button>
      </div>
    </section>
  );
}

export default Home;
