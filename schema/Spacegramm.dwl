// ==========================================
// SPACEGRAMM CORE SCHEMA (Web4 Graph Model)
// ==========================================


// =========================
// ENTITY (CORE NODE)
// =========================
type Entity {
  id: string
  name: string
  type: string              // channel | game | movie | user | post | space | ai_agent
  source: string            // youtube | tmdb | rawg | anilist | mattermost | custom

  url?: string
  description?: string

  tags?: [string]

  created_at: datetime
  updated_at: datetime

  metadata?: object
}


// =========================
// SPACE (CONTAINER / WORLD)
// =========================
type Space {
  id: string
  name: string
  description?: string

  category: string          // gaming | education | entertainment | ai | finance | web3

  entities: [Entity]        // everything inside the space

  created_by: string        // user_id or system
  visibility: string        // public | private | restricted

  created_at: datetime
  updated_at: datetime
}


// =========================
// USER
// =========================
type User {
  id: string
  username: string
  display_name?: string

  avatar?: string

  spaces: [Space]
  follows: [Entity]

  reputation?: number

  created_at: datetime
}


// =========================
// RELATION (GRAPH EDGE)
// =========================
type Relation {
  id: string

  from_id: string
  to_id: string

  type: string
  // examples:
  // follows
  // belongs_to
  // creates
  // interacts_with
  // related_to
  // indexes

  weight?: float            // relevance score
  timestamp: datetime
}


// =========================
// DISCOVERY QUERY RESULT
// =========================
type DiscoveryResult {
  query: string

  entities: [Entity]

  spaces: [Space]

  relations: [Relation]

  score?: float
}


// =========================
// AI AGENT (ENGINE LAYER)
// =========================
type AIAgent {
  id: string
  name: string

  role: string
  // indexer | recommender | ranker | crawler | summarizer

  memory?: object

  connected_sources: [string]

  last_run: datetime
}


// =========================
// ACTIVITY STREAM
// =========================
type Activity {
  id: string

  user_id: string

  action: string
  // search | follow | join_space | create_entity | interact

  target_id?: string

  timestamp: datetime
}
