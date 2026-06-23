import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import Watchlist from "./pages/Watchlist";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/profile";
import AdminDashboard from "./pages/AdminDashboard";
import Collections from "./pages/Collections";

import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
      <Toaster position="top-right" />

      <Routes>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/collections"
          element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;