import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CollectionCard from "../components/collections/CollectionCard";
import { useToast } from "../context/ToastContext";
import API from "../services/api";

import "../styles/Collections.css";

function PublicCollections() {

  const { showToast } = useToast();

  const [collections, setCollections] =
    useState([]);
  const [query, setQuery] =
    useState("");
  const [loading, setLoading] =
    useState(true);

  const loadCollections = useCallback(async (searchQuery = "") => {

    try {

      setLoading(true);

      const endpoint =
        searchQuery.trim()
          ? `/collections/search?query=${encodeURIComponent(searchQuery)}`
          : "/collections/public";

      const response =
        await API.get(endpoint);

      setCollections(response.data);

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to load public collections",
        "error"
      );

    } finally {

      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {

    loadCollections();

  }, [loadCollections]);

  return (
    <div className="collections-page page-shell">
      <Navbar />

      <main className="collections-inner">
        <header className="collections-header">
          <div>
            <h1 className="page-title">
              Public Collections
            </h1>
            <p className="page-subtitle">
              Search public collections by collection name or owner.
            </p>
          </div>
        </header>

        <section className="collections-searchbar glass-panel">
          <input
            type="text"
            value={query}
            placeholder="Search by collection or owner"
            onChange={(event) =>
              setQuery(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                loadCollections(query);
              }
            }}
          />

          <button
            className="primary-action"
            onClick={() =>
              loadCollections(query)
            }
          >
            Search
          </button>
        </section>

        {loading ? (
          <div className="collections-empty glass-panel">
            Loading public collections...
          </div>
        ) : collections.length === 0 ? (
          <div className="collections-empty glass-panel">
            No public collections found.
          </div>
        ) : (
          <section className="collections-grid">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
              />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default PublicCollections;
