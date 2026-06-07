import os
import requests
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional


# =========================
# CORE DATA MODEL
# =========================

@dataclass
class Entity:
    name: str
    category: str
    source: str
    url: str = ""
    description: str = ""
    rating: float = 0.0
    meta: Optional[Dict] = None


# =========================
# BASE COLLECTOR
# =========================

class BaseCollector:
    def search(self, keyword: str) -> List[Entity]:
        raise NotImplementedError


# =========================
# YOUTUBE
# =========================

class YouTubeCollector(BaseCollector):
    def __init__(self):
        self.api_key = os.getenv("YOUTUBE_API_KEY")

    def search(self, keyword: str, limit=10) -> List[Entity]:
        if not self.api_key:
            return []

        url = (
            "https://www.googleapis.com/youtube/v3/search"
            f"?part=snippet&type=channel&q={keyword}"
            f"&maxResults={limit}&key={self.api_key}"
        )

        data = requests.get(url, timeout=15).json()
        results = []

        for item in data.get("items", []):
            snip = item.get("snippet", {})
            cid = snip.get("channelId")

            results.append(Entity(
                name=snip.get("title", ""),
                category="YouTube Channel",
                source="YouTube",
                url=f"https://youtube.com/channel/{cid}",
                description=snip.get("description", "")
            ))

        return results


# =========================
# MOVIES / TV (TMDB)
# =========================

class TMDBCollector(BaseCollector):
    def __init__(self):
        self.api_key = os.getenv("TMDB_API_KEY")

    def search(self, keyword: str) -> List[Entity]:
        if not self.api_key:
            return []

        url = (
            "https://api.themoviedb.org/3/search/multi"
            f"?api_key={self.api_key}&query={keyword}"
        )

        data = requests.get(url, timeout=15).json()
        results = []

        for item in data.get("results", []):
            title = item.get("title") or item.get("name") or "Unknown"

            results.append(Entity(
                name=title,
                category=item.get("media_type", "unknown"),
                source="TMDB",
                url="https://www.themoviedb.org",
                rating=item.get("vote_average", 0)
            ))

        return results


# =========================
# GAMES (RAWG)
# =========================

class GameCollector(BaseCollector):
    def __init__(self):
        self.api_key = os.getenv("RAWG_API_KEY")

    def search(self, keyword: str) -> List[Entity]:
        if not self.api_key:
            return []

        url = (
            "https://api.rawg.io/api/games"
            f"?key={self.api_key}&search={keyword}"
        )

        data = requests.get(url, timeout=15).json()
        results = []

        for game in data.get("results", []):
            results.append(Entity(
                name=game.get("name"),
                category="Game",
                source="RAWG",
                url=f"https://rawg.io/games/{game.get('slug')}",
                rating=game.get("rating", 0)
            ))

        return results


# =========================
# ANIME (AniList)
# =========================

class AnimeCollector(BaseCollector):

    def search(self, keyword: str) -> List[Entity]:
        query = """
        query ($search: String) {
            Page {
                media(search: $search) {
                    title { romaji }
                    type
                }
            }
        }
        """

        r = requests.post(
            "https://graphql.anilist.co",
            json={"query": query, "variables": {"search": keyword}}
        )

        data = r.json()
        media = data.get("data", {}).get("Page", {}).get("media", [])

        return [
            Entity(
                name=m["title"]["romaji"],
                category=m.get("type", "Anime"),
                source="AniList",
                url="https://anilist.co"
            )
            for m in media
        ]


# =========================
# BOOKS
# =========================

class BookCollector(BaseCollector):

    def search(self, keyword: str) -> List[Entity]:
        url = f"https://www.googleapis.com/books/v1/volumes?q={keyword}"
        data = requests.get(url).json()

        results = []

        for item in data.get("items", []):
            info = item.get("volumeInfo", {})

            results.append(Entity(
                name=info.get("title", ""),
                category="Book",
                source="Google Books",
                url=info.get("infoLink", "")
            ))

        return results


# =========================
# MUSIC (iTunes)
# =========================

class MusicCollector(BaseCollector):

    def search(self, keyword: str) -> List[Entity]:
        url = f"https://itunes.apple.com/search?term={keyword}&entity=musicArtist"
        data = requests.get(url).json()

        return [
            Entity(
                name=a.get("artistName", ""),
                category="Music Artist",
                source="iTunes",
                url=a.get("artistLinkUrl", "")
            )
            for a in data.get("results", [])
        ]


# =========================
# PODCASTS
# =========================

class PodcastCollector(BaseCollector):

    def search(self, keyword: str) -> List[Entity]:
        url = f"https://itunes.apple.com/search?term={keyword}&entity=podcast"
        data = requests.get(url).json()

        return [
            Entity(
                name=p.get("collectionName", ""),
                category="Podcast",
                source="Apple Podcasts",
                url=p.get("collectionViewUrl", "")
            )
            for p in data.get("results", [])
        ]


# =========================
# ENGINE (CORE ORCHESTRATOR)
# =========================

class UniversalDiscoveryEngine:

    def __init__(self):
        self.collectors: List[BaseCollector] = [
            YouTubeCollector(),
            TMDBCollector(),
            GameCollector(),
            AnimeCollector(),
            BookCollector(),
            MusicCollector(),
            PodcastCollector()
        ]

    def search(self, keyword: str) -> List[Entity]:
        results: List[Entity] = []

        for collector in self.collectors:
            try:
                results.extend(collector.search(keyword))
            except Exception as e:
                print(f"[WARN] {collector.__class__.__name__}: {e}")

        return results


# =========================
# EXPORT
# =========================

def export_csv(results: List[Entity], filename: str):
    if not results:
        return

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=asdict(results[0]).keys())
        writer.writeheader()

        for r in results:
            writer.writerow(asdict(r))


# =========================
# RUN
# =========================

if __name__ == "__main__":

    keyword = input("Search: ")

    engine = UniversalDiscoveryEngine()
    results = engine.search(keyword)

    # print results
    for r in results:
        print(f"[{r.category}] {r.name} ({r.source})")

    # export
    if results:
        export_csv(results, f"{keyword}.csv")
        print(f"\nSaved {len(results)} results.")
