import os
import requests

from app.models.favorite import Favorite
from app.models.search_history import SearchHistory
from app.models.viewed_movie import ViewedMovie

OMDB_API_KEY = os.getenv("OMDB_API_KEY")


def generate_recommendations(db, user_id):

    recommendations = []
    seen_movies = set()

    searches = (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == user_id)
        .order_by(SearchHistory.searched_at.desc())
        .limit(5)
        .all()
    )

    favorites = (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id)
        .all()
    )

    viewed_movies = (
        db.query(ViewedMovie)
        .filter(ViewedMovie.user_id == user_id)
        .all()
    )

    keywords = []

    # Search history
    for search in searches:

        if search.keyword:

            keywords.append(
                (
                    search.keyword,
                    "Based on your recent searches"
                )
            )

    # Favorites
    for favorite in favorites:

        if favorite.title:

            keywords.append(
                (
                    favorite.title,
                    "Based on your favorites"
                )
            )

    # Viewed movies
    for movie in viewed_movies:

        if movie.title:

            keywords.append(
                (
                    movie.title,
                    "Similar to movies you viewed"
                )
            )

    for keyword, reason in keywords:

        try:

            search_url = (
                f"https://www.omdbapi.com/"
                f"?apikey={OMDB_API_KEY}"
                f"&s={keyword}"
            )

            response = requests.get(search_url)
            data = response.json()

            if "Search" not in data:
                continue

            for movie in data["Search"]:

                imdb_id = movie["imdbID"]

                if imdb_id in seen_movies:
                    continue

                details_url = (
                    f"https://www.omdbapi.com/"
                    f"?apikey={OMDB_API_KEY}"
                    f"&i={imdb_id}"
                )

                details = requests.get(
                    details_url
                ).json()

                # Skip incomplete movies
                if (
                    details.get("Poster") == "N/A"
                    or details.get("Genre") == "N/A"
                    or details.get("Plot") == "N/A"
                    or details.get("imdbRating") == "N/A"
                ):
                    continue

                seen_movies.add(imdb_id)

                recommendations.append(
                    {
                        "id": imdb_id,
                        "title": details["Title"],
                        "poster": details["Poster"],
                        "genre": details["Genre"],
                        "rating": details["imdbRating"],
                        "story": details["Plot"],
                        "year": details["Year"],
                        "reason": reason
                    }
                )

                if len(recommendations) >= 12:
                    return recommendations

        except Exception as e:

            print(
                f"Recommendation Error: {e}"
            )

    return recommendations