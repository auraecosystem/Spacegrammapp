from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

engine = UniversalDiscoveryEngine()


class Query(BaseModel):
    text: str


@app.post("/api/search")
def search(q: Query):
    results = engine.search(q.text)

    return {
        "query": q.text,
        "results": [
            {
                "name": r.name,
                "category": r.category,
                "source": r.source,
                "url": r.url
            }
            for r in results
        ]
    }
