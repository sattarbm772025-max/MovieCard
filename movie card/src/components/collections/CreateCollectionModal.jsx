import {
  useEffect,
  useState,
} from "react";

function CreateCollectionModal({
  open,
  mode = "create",
  initialCollection,
  onClose,
  onSubmit,
}) {

  const [form, setForm] =
    useState({
      name: "",
      description: "",
      visibility: "private",
    });

  useEffect(() => {

    if (initialCollection) {
      setForm({
        name: initialCollection.name || "",
        description:
          initialCollection.description || "",
        visibility:
          initialCollection.visibility || "private",
      });
      return;
    }

    setForm({
      name: "",
      description: "",
      visibility: "private",
    });

  }, [initialCollection, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="collection-modal-backdrop">
      <section className="collection-modal glass-panel">
        <h2>
          {mode === "edit"
            ? "Edit Collection"
            : "Create Collection"}
        </h2>

        <label>
          Collection Name
          <input
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value,
              })
            }
          />
        </label>

        <label>
          Description
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) =>
              setForm({
                ...form,
                description: event.target.value,
              })
            }
          />
        </label>

        <label>
          Visibility
          <select
            value={form.visibility}
            onChange={(event) =>
              setForm({
                ...form,
                visibility: event.target.value,
              })
            }
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </label>

        <div className="collection-modal-actions">
          <button
            className="primary-action"
            onClick={() =>
              onSubmit(form)
            }
          >
            {mode === "edit" ? "Save" : "Create"}
          </button>

          <button
            className="danger-action"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}

export default CreateCollectionModal;
