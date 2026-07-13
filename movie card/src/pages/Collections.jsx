import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CollectionCard from "../components/collections/CollectionCard";
import CreateCollectionModal from "../components/collections/CreateCollectionModal";
import { useToast } from "../context/ToastContext";
import API from "../services/api";

import "../styles/Collections.css";

function Collections() {

  const { showToast } = useToast();

  const [collections, setCollections] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [sortOrder, setSortOrder] =
    useState("newest");
  const [modalOpen, setModalOpen] =
    useState(false);
  const [editingCollection, setEditingCollection] =
    useState(null);

  const loadCollections = useCallback(async () => {

    try {

      setLoading(true);

      const response =
        await API.get(
          `/collections?sort=${sortOrder}`
        );

      setCollections(response.data);

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to load collections",
        "error"
      );

    } finally {

      setLoading(false);
    }
  }, [showToast, sortOrder]);

  useEffect(() => {

    loadCollections();

  }, [loadCollections]);

  const openCreateModal = () => {
    setEditingCollection(null);
    setModalOpen(true);
  };

  const openEditModal = (collection) => {
    setEditingCollection(collection);
    setModalOpen(true);
  };

  const submitCollection = async (form) => {

    if (!form.name.trim()) {
      showToast("Collection name is required", "error");
      return;
    }

    try {

      if (editingCollection) {
        await API.put(
          `/collections/${editingCollection.id}`,
          form
        );
        showToast("Collection updated");
      } else {
        await API.post(
          "/collections",
          form
        );
        showToast("Collection created");
      }

      setModalOpen(false);
      setEditingCollection(null);
      loadCollections();

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to save collection",
        "error"
      );
    }
  };

  const deleteCollection = async (collectionId) => {

    try {

      await API.delete(
        `/collections/${collectionId}`
      );

      showToast("Collection deleted");
      loadCollections();

    } catch (error) {

      showToast(
        error.response?.data?.detail ||
        "Failed to delete collection",
        "error"
      );
    }
  };

  return (
    <div className="collections-page page-shell">
      <Navbar />

      <main className="collections-inner">
        <header className="collections-header">
          <div>
            <h1 className="page-title">
              Movie Collections
            </h1>
            <p className="page-subtitle">
              Organize movies into custom private or public collections.
            </p>
          </div>

          <div className="collections-header-actions">
            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value)
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            <button
              className="primary-action"
              onClick={openCreateModal}
            >
              New Collection
            </button>
          </div>
        </header>

        {loading ? (
          <div className="collections-empty glass-panel">
            Loading collections...
          </div>
        ) : collections.length === 0 ? (
          <div className="collections-empty glass-panel">
            <h2>No collections yet</h2>
            <p>Create your first collection to organize movies.</p>
          </div>
        ) : (
          <section
            className={
              collections.length === 1
                ? "collections-grid single-card"
                : "collections-grid"
            }
          >
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                canManage
                onEdit={openEditModal}
                onDelete={deleteCollection}
              />
            ))}
          </section>
        )}
      </main>

      <CreateCollectionModal
        open={modalOpen}
        mode={editingCollection ? "edit" : "create"}
        initialCollection={editingCollection}
        onClose={() => {
          setModalOpen(false);
          setEditingCollection(null);
        }}
        onSubmit={submitCollection}
      />

      <Footer />
    </div>
  );
}

export default Collections;
