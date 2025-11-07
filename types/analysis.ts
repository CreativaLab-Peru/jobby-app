export interface ScoreItem {
  name: string
  points: number
  status: "complete" | "partial" | "missing"
}

export interface ScoreCategory {
  category: string
  icon: any
  score: number
  maxScore: number
  color: string
  bgColor: string
  items: ScoreItem[]
}

export interface Recommendation {
  type: "critical" | "important" | "suggestion"
  icon: any
  title: string
  description: string
  impact: string
}

export interface Opportunity {
  title: string
  match: number
  type: string
  deadline: string
  requirements: string[]
  url: string
}
