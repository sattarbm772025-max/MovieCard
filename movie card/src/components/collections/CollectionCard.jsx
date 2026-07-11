import { Link } from "react-router-dom";

function CollectionCard({
  collection,
  onEdit,
  onDelete,
  canManage = false,
}) {

  const createdDate =
    collection.created_at
      ? new Date(collection.created_at)
          .toLocaleDateString()
      : "N/A";

  return (
    <article className="collection-card glass-panel">
      <div
        className="collection-cover"
        style={{
          backgroundImage:
            collection.cover_image
              ? `url(${collection.cover_image})`
              : undefined,
        }}
      >
        <span>
          {collection.visibility === "public"
            ? "Public"
            : "Private"}
        </span>
      </div>

      <div className="collection-card-body">
        <h2>{collection.name}</h2>
        <p>
          {collection.description ||
            "No description added yet."}
        </p>

        <div className="collection-card-meta">
          <span>{collection.movie_count || 0} Movies</span>
          <span>{createdDate}</span>
        </div>

        {collection.owner_name && (
          <p className="collection-owner">
            Owner: {collection.owner_name}
          </p>
        )}

        <div className="collection-actions">
          <Link
            className="primary-action"
            to={`/collections/${collection.id}`}
          >
            View Collection
          </Link>

          {canManage && (
            <>
              <button
                className="ghost-action"
                onClick={() =>
                  onEdit(collection)
                }
              >
                Edit
              </button>

              <button
                className="danger-action"
                onClick={() =>
                  onDelete(collection.id)
                }
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default CollectionCard;
