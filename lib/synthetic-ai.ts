import {
  careAccessSeries,
  conditionBreakdown,
  doctorProfiles,
  healthCenters,
  insightSeries,
  mortalitySeries,
  newsArticles,
  trainingExamples,
  type DoctorProfile,
  type HealthCenter,
  type NewsArticle,
  type TrainingExample,
} from "./offline-data"

export type HealthAdvice = {
  condition: string
  urgency: "routine" | "soon" | "urgent"
  confidence: number
  summary: string
  advice: string[]
  redFlags: string[]
  matchedSignals: string[]
}

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "because",
  "for",
  "from",
  "have",
  "has",
  "i",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "please",
  "that",
  "the",
  "to",
  "with",
  "my",
  "me",
  "we",
  "you",
  "your",
  "feel",
  "feels",
  "feeling",
  "days",
  "day",
  "since",
])

function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function tokenize(input: string) {
  return normalize(input)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !stopWords.has(token))
}

function expandExample(example: TrainingExample) {
  const tokens = tokenize(example.input)
  return tokens.length > 0 ? tokens : [example.condition]
}

type ConditionModel = {
  condition: string
  keywords: Map<string, number>
  advice: string[]
  redFlags: string[]
  urgency: "routine" | "soon" | "urgent"
  baseSignals: string[]
}

function trainConditionModel() {
  const models = new Map<string, ConditionModel>()

  for (const example of trainingExamples) {
    const current = models.get(example.condition) ?? {
      condition: example.condition,
      keywords: new Map<string, number>(),
      advice: example.advice,
      redFlags: example.redFlags,
      urgency: example.urgency,
      baseSignals: [],
    }

    for (const token of expandExample(example)) {
      current.keywords.set(token, (current.keywords.get(token) ?? 0) + 1)
      if (!current.baseSignals.includes(token)) {
        current.baseSignals.push(token)
      }
    }

    models.set(example.condition, current)
  }

  return Array.from(models.values())
}

const conditionModel = trainConditionModel()

function scoreCondition(queryTokens: string[], model: ConditionModel) {
  let score = 0
  const matchedSignals: string[] = []

  for (const token of queryTokens) {
    const weight = model.keywords.get(token)
    if (weight) {
      score += weight
      matchedSignals.push(token)
    }
  }

  return { score, matchedSignals }
}

const urgencyRank: Record<HealthAdvice["urgency"], number> = {
  routine: 0,
  soon: 1,
  urgent: 2,
}

export function analyzeSymptoms(question: string): HealthAdvice {
  const tokens = tokenize(question)
  const scored = conditionModel
    .map((model) => ({
      model,
      ...scoreCondition(tokens, model),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score
      return urgencyRank[right.model.urgency] - urgencyRank[left.model.urgency]
    })

  const top = scored[0] ?? conditionModel[0]
  const confidence = top.score > 0 ? Math.min(0.96, 0.54 + top.score / 10) : 0.42
  const matchedSignals = scored[0]?.matchedSignals.length
    ? Array.from(new Set(scored[0].matchedSignals))
    : tokens.slice(0, 4)

  const summary =
    top.score > 0
      ? `The offline triage agent matched your symptoms most closely with ${top.model.condition}. It is trained from synthetic examples bundled with the project and prioritizes immediate safety checks.`
      : "The offline triage agent could not isolate one condition confidently, so it is returning broad, low-risk guidance trained from synthetic examples."

  return {
    condition: top.model.condition,
    urgency: top.model.urgency,
    confidence,
    summary,
    advice: top.model.advice,
    redFlags: top.model.redFlags,
    matchedSignals,
  }
}

export type DoctorMatch = DoctorProfile & {
  score: number
  reasons: string[]
}

const locationAliases: Record<string, string[]> = {
  mumbai: ["mumbai", "maharashtra"],
  pune: ["pune", "maharashtra"],
  surat: ["surat", "gujarat"],
  chennai: ["chennai", "tamil", "tamil nadu"],
  lucknow: ["lucknow", "uttar pradesh", "up"],
  indore: ["indore", "madhya pradesh", "mp"],
  kolkata: ["kolkata", "west bengal", "bengal"],
}

function resolveLocationSignals(location: string) {
  const normalized = normalize(location)
  const signals = new Set<string>()

  for (const [key, aliases] of Object.entries(locationAliases)) {
    if (normalized.includes(key) || aliases.some((alias) => normalized.includes(alias))) {
      aliases.forEach((alias) => signals.add(alias))
    }
  }

  tokenize(location).forEach((token) => signals.add(token))
  return Array.from(signals)
}

export function searchDoctors(condition: string, location: string) {
  const query = normalize(`${condition} ${location}`)
  const tokens = tokenize(query)
  const locationSignals = resolveLocationSignals(location)

  return doctorProfiles
    .map((doctor) => {
      const reasonSet = new Set<string>()
      let score = doctor.rating

      if (locationSignals.length > 0) {
        const doctorLocationText = normalize(doctor.location)
        const matchedLocation = locationSignals.some((signal) => doctorLocationText.includes(signal))
        if (matchedLocation) {
          score += 3.5
          reasonSet.add(`Matches location ${location}`)
        }
      }

      for (const area of doctor.areas) {
        const areaTokens = tokenize(area)
        if (areaTokens.some((token) => tokens.includes(token))) {
          score += 3
          reasonSet.add(`Matches ${area}`)
        }
      }

      for (const language of doctor.languages) {
        const languageToken = normalize(language)
        if (query.includes(languageToken)) {
          score += 0.8
          reasonSet.add(`Speaks ${language}`)
        }
      }

      const locationTokens = tokenize(doctor.location)
      if (locationTokens.some((token) => tokens.includes(token))) {
        score += 1.5
        reasonSet.add(`Near ${doctor.location}`)
      }

      if (locationSignals.some((signal) => normalize(doctor.location).includes(signal))) {
        score += 1.25
        reasonSet.add(`Aligned with ${doctor.location}`)
      }

      if (doctor.teleconsult) {
        score += 0.5
        reasonSet.add("Teleconsult available")
      }

      return {
        ...doctor,
        score,
        reasons: Array.from(reasonSet),
      }
    })
    .sort((left, right) => right.score - left.score)
}

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

export function haversineKm(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
) {
  const earthRadius = 6371
  const deltaLatitude = toRadians(latitudeB - latitudeA)
  const deltaLongitude = toRadians(longitudeB - longitudeA)
  const a =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos(toRadians(latitudeA)) * Math.cos(toRadians(latitudeB)) *
      Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2)
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export type NearbyCenter = HealthCenter & {
  distanceKm: number
}

export function findNearbyHealthCenters(latitude: number, longitude: number, typeFilter = "all") {
  return healthCenters
    .filter((center) => typeFilter === "all" || center.type === typeFilter)
    .map((center) => ({
      ...center,
      distanceKm: haversineKm(latitude, longitude, center.latitude, center.longitude),
    }))
    .sort((left, right) => left.distanceKm - right.distanceKm)
}

export function getNewsByLanguage(language: string): NewsArticle[] {
  const normalized = normalize(language)
  const matches = newsArticles.filter((article) => normalize(article.language).includes(normalized))
  return matches.length > 0 ? matches : newsArticles.filter((article) => article.language === "English")
}

export function getInsights() {
  return {
    lifeExpectancy: insightSeries,
    healthConditions: conditionBreakdown,
    mortality: mortalitySeries,
    careAccess: careAccessSeries,
  }
}

export function buildNewsBrief(language: string) {
  const articles = getNewsByLanguage(language)
  const headlines = articles.slice(0, 2).map((article) => article.title)
  return {
    summary:
      `Local news brief for ${language}: ` +
      headlines.join(" | ") +
      ". All items are bundled with the project as offline synthetic editorial samples.",
    articles,
  }
}
