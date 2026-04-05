from __future__ import annotations

import json
import math
import sqlite3
import re
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import parse_qs, urlparse

PORT = 5000
DATABASE_PATH = Path(__file__).with_name("data") / "gramaarogya.sqlite3"

STOP_WORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "for",
    "from",
    "have",
    "has",
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
}

TRAINING_EXAMPLES = [
    {
        "condition": "dehydration",
        "input": "dizzy dry mouth after vomiting and not drinking water",
        "urgency": "soon",
        "advice": [
            "Sip oral rehydration solution or clean water in small amounts.",
            "Rest in a cool place and avoid heavy meals.",
            "If confusion, fainting, or very little urine appears, seek urgent care.",
        ],
        "red_flags": ["confusion", "fainting", "no urine", "persistent vomiting"],
    },
    {
        "condition": "respiratory infection",
        "input": "fever sore throat cough body ache",
        "urgency": "routine",
        "advice": [
            "Rest, hydrate, and monitor temperature.",
            "Use a mask around others and keep distance until symptoms ease.",
            "If breathing becomes hard or fever stays high, consult a clinician.",
        ],
        "red_flags": ["breathing difficulty", "chest pain", "bluish lips"],
    },
    {
        "condition": "stomach illness",
        "input": "stomach pain loose motions nausea after street food",
        "urgency": "soon",
        "advice": [
            "Drink fluids often and keep meals light.",
            "Avoid oily food for a day or two.",
            "If blood in stool, severe pain, or dehydration appears, get checked.",
        ],
        "red_flags": ["blood in stool", "severe pain", "dehydration"],
    },
    {
        "condition": "blood sugar concern",
        "input": "thirst frequent urination fatigue blurred vision",
        "urgency": "urgent",
        "advice": [
            "Arrange a blood sugar check as soon as possible.",
            "Keep hydrated and avoid sugary drinks until reviewed.",
            "If drowsiness or vomiting develops, seek urgent medical help.",
        ],
        "red_flags": ["drowsiness", "vomiting", "rapid breathing"],
    },
    {
        "condition": "skin irritation",
        "input": "itchy red rash on arms after working in the field",
        "urgency": "routine",
        "advice": [
            "Wash the skin gently and keep it dry.",
            "Avoid scratching and watch for spreading rash.",
            "If swelling, fever, or pus appears, consult a doctor.",
        ],
        "red_flags": ["swelling", "fever", "pus"],
    },
]

DOCTORS = [
    {
        "name": "Dr. Asha Kulkarni",
        "specialization": "Family Medicine",
        "experience": "14 years",
        "fee": "Rs. 300",
        "languages": ["English", "Marathi", "Hindi"],
        "location": "Pune, Maharashtra",
        "areas": ["fever", "cough", "diabetes", "blood pressure"],
        "teleconsult": True,
        "rating": 4.9,
        "profileUrl": "https://example.com/doctors/asha-kulkarni",
    },
    {
        "name": "Dr. Imran Shaikh",
        "specialization": "General Physician",
        "experience": "11 years",
        "fee": "Rs. 250",
        "languages": ["English", "Hindi", "Gujarati"],
        "location": "Surat, Gujarat",
        "areas": ["stomach pain", "dehydration", "fever", "vomiting"],
        "teleconsult": True,
        "rating": 4.8,
        "profileUrl": "https://example.com/doctors/imran-shaikh",
    },
    {
        "name": "Dr. Nandini Rao",
        "specialization": "Paediatrics",
        "experience": "16 years",
        "fee": "Rs. 500",
        "languages": ["English", "Hindi", "Tamil"],
        "location": "Chennai, Tamil Nadu",
        "areas": ["child health", "vaccination", "fever", "nutrition"],
        "teleconsult": False,
        "rating": 4.9,
        "profileUrl": "https://example.com/doctors/nandini-rao",
    },
    {
        "name": "Dr. Farah Khan",
        "specialization": "Dermatology",
        "experience": "9 years",
        "fee": "Rs. 450",
        "languages": ["English", "Hindi", "Urdu"],
        "location": "Lucknow, Uttar Pradesh",
        "areas": ["skin rash", "allergy", "itching", "infection"],
        "teleconsult": True,
        "rating": 4.7,
        "profileUrl": "https://example.com/doctors/farah-khan",
    },
    {
        "name": "Dr. Prakash Mehta",
        "specialization": "Internal Medicine",
        "experience": "19 years",
        "fee": "Rs. 600",
        "languages": ["English", "Hindi"],
        "location": "Indore, Madhya Pradesh",
        "areas": ["diabetes", "fatigue", "hypertension", "chest pain"],
        "teleconsult": False,
        "rating": 4.95,
        "profileUrl": "https://example.com/doctors/prakash-mehta",
    },
    {
        "name": "Dr. Sanya Bose",
        "specialization": "Community Health",
        "experience": "8 years",
        "fee": "Rs. 200",
        "languages": ["English", "Bengali", "Hindi"],
        "location": "Kolkata, West Bengal",
        "areas": ["fever", "pregnancy care", "nutrition", "child health"],
        "teleconsult": True,
        "rating": 4.85,
        "profileUrl": "https://example.com/doctors/sanya-bose",
    },
]

HEALTH_CENTERS = [
    {"name": "Gram Aarogya Wellness Center", "type": "public", "address": "Sector 12, Navi Mumbai", "latitude": 19.033, "longitude": 73.029, "services": ["primary care", "immunization", "maternal health"]},
    {"name": "Saksham Rural Clinic", "type": "clinic", "address": "Hinjewadi, Pune", "latitude": 18.591, "longitude": 73.737, "services": ["family medicine", "basic labs", "teleconsult"]},
    {"name": "Jan Arogya Hospital", "type": "private", "address": "Banjara Hills, Hyderabad", "latitude": 17.412, "longitude": 78.449, "services": ["emergency", "internal medicine", "paediatrics"]},
    {"name": "Niramaya Health Post", "type": "public", "address": "Salt Lake, Kolkata", "latitude": 22.585, "longitude": 88.459, "services": ["vaccination", "antenatal care", "screening"]},
    {"name": "Aarogya Seva Medical Hub", "type": "medical", "address": "T Nagar, Chennai", "latitude": 13.042, "longitude": 80.238, "services": ["pharmacy", "diagnostics", "urgent care"]},
    {"name": "Sehat Sathi Clinic", "type": "clinic", "address": "Vijay Nagar, Indore", "latitude": 22.753, "longitude": 75.896, "services": ["general consultation", "diabetes care", "blood pressure check"]},
]

NEWS = [
    {"language": "English", "title": "Rural screening camps expand across five districts", "description": "Local health workers are bringing blood pressure and diabetes checks to weekly village camps.", "content": "The latest outreach program pairs mobile nurses with community volunteers so residents can receive quick screenings, medication guidance, and referral support before conditions become emergencies.", "source": "GramAarogya Desk", "date": "2026-04-05T08:15:00Z", "url": "https://example.com/news/rural-screening-camps"},
    {"language": "English", "title": "Synthetic triage agent flags dehydration early", "description": "An offline assistant now detects dehydration patterns from short symptom inputs and recommends next steps.", "content": "The agent was trained on synthetic symptom phrases and can now suggest oral rehydration, rest, and when to escalate to a clinician. The emphasis remains on safety and quick local action.", "source": "Health Systems Lab", "date": "2026-04-03T10:00:00Z", "url": "https://example.com/news/dehydration-agent"},
    {"language": "Hindi", "title": "गांवों में पोषण जांच शिविरों का विस्तार", "description": "स्थानीय स्वास्थ्यकर्मी नियमित शिविरों में रक्तचाप और मधुमेह जांच उपलब्ध करा रहे हैं।", "content": "यह कार्यक्रम समुदाय स्वयंसेवकों के साथ मोबाइल नर्सों को जोड़ता है, ताकि लोग समय पर जांच, दवा सलाह और रेफरल सहायता प्राप्त कर सकें।", "source": "ग्रामआरोग्य डेस्क", "date": "2026-04-04T09:30:00Z", "url": "https://example.com/news/hindi-screening"},
    {"language": "Gujarati", "title": "ગ્રામિણ આરોગ્ય સહાય માટે નવા માર્ગદર્શિકા બહાર પડી", "description": "સ્થાનિક આરોગ્ય કેન્દ્રોને પ્રાથમિક તપાસ અને તાત્કાલિક સંદર્ભ માટે નવા માર્ગદર્શન મળ્યા છે.", "content": "આ માર્ગદર્શિકામાં લક્ષણ આધારિત વહેલી ઓળખ, ડાયાબિટીસ દેખરેખ, અને બાળકોના પોષણ માટે ઝડપી સંદર્ભ પગલાં સમાવાયા છે.", "source": "Aarogya Brief", "date": "2026-04-02T06:45:00Z", "url": "https://example.com/news/gujarati-guide"},
    {"language": "Tamil", "title": "ஆஃப்லைன் உதவியாளர்கள் கிராம சுகாதாரத்தை விரிவாக்குகின்றனர்", "description": "தொலைநிலை பகுதிகளில் அறிகுறி அடிப்படையிலான வழிகாட்டல் இப்போது உள்ளூர் சாதனங்களில் இயங்குகிறது.", "content": "சீரமைக்கப்பட்ட சோதனை தரவின் மூலம் பயிற்றப்பட்ட உதவியாளர்கள், பொதுவான அறிகுறிகளுக்கு முன்னுரிமை அளித்து, நம்பகமான அடுத்த படிகளை பரிந்துரைக்கின்றனர்.", "source": "Health Grid Tamil", "date": "2026-04-01T11:20:00Z", "url": "https://example.com/news/tamil-assistant"},
]

INSIGHTS = {
    "life_expectancy": [
        {"year": 2015, "urban": 67.2, "rural": 61.1},
        {"year": 2017, "urban": 68.1, "rural": 62.4},
        {"year": 2019, "urban": 69.4, "rural": 64.3},
        {"year": 2021, "urban": 70.2, "rural": 65.1},
        {"year": 2023, "urban": 71.1, "rural": 66.5},
        {"year": 2025, "urban": 71.8, "rural": 67.4},
    ],
    "health_conditions": [
        {"label": "Respiratory", "urban": 22, "rural": 31},
        {"label": "Gastrointestinal", "urban": 17, "rural": 24},
        {"label": "Hypertension", "urban": 28, "rural": 21},
        {"label": "Maternal Care", "urban": 14, "rural": 23},
        {"label": "Child Nutrition", "urban": 19, "rural": 27},
    ],
    "mortality": [
        {"year": 2015, "urban": 29, "rural": 48},
        {"year": 2017, "urban": 27, "rural": 44},
        {"year": 2019, "urban": 24, "rural": 40},
        {"year": 2021, "urban": 22, "rural": 36},
        {"year": 2023, "urban": 20, "rural": 33},
        {"year": 2025, "urban": 18, "rural": 30},
    ],
    "care_access": [
        {"year": 2015, "urban": 83, "rural": 58},
        {"year": 2017, "urban": 85, "rural": 61},
        {"year": 2019, "urban": 87, "rural": 64},
        {"year": 2021, "urban": 89, "rural": 67},
        {"year": 2023, "urban": 91, "rural": 70},
        {"year": 2025, "urban": 93, "rural": 73},
    ],
}


def get_connection() -> sqlite3.Connection:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    with get_connection() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS training_examples (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                condition TEXT NOT NULL,
                input TEXT NOT NULL,
                urgency TEXT NOT NULL,
                advice TEXT NOT NULL,
                red_flags TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS doctors (
                name TEXT PRIMARY KEY,
                specialization TEXT NOT NULL,
                experience TEXT NOT NULL,
                fee TEXT NOT NULL,
                languages TEXT NOT NULL,
                location TEXT NOT NULL,
                areas TEXT NOT NULL,
                teleconsult INTEGER NOT NULL,
                rating REAL NOT NULL,
                profile_url TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS health_centers (
                name TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                address TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                services TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS news (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                language TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                content TEXT NOT NULL,
                source TEXT NOT NULL,
                date TEXT NOT NULL,
                url TEXT NOT NULL
            );
            """
        )

        if connection.execute("SELECT COUNT(*) FROM training_examples").fetchone()[0] == 0:
            connection.executemany(
                """
                INSERT INTO training_examples (condition, input, urgency, advice, red_flags)
                VALUES (?, ?, ?, ?, ?)
                """,
                [
                    (
                        example["condition"],
                        example["input"],
                        example["urgency"],
                        json.dumps(example["advice"]),
                        json.dumps(example["red_flags"]),
                    )
                    for example in TRAINING_EXAMPLES
                ],
            )

        if connection.execute("SELECT COUNT(*) FROM doctors").fetchone()[0] == 0:
            connection.executemany(
                """
                INSERT INTO doctors (
                    name, specialization, experience, fee, languages, location, areas, teleconsult, rating, profile_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        doctor["name"],
                        doctor["specialization"],
                        doctor["experience"],
                        doctor["fee"],
                        json.dumps(doctor["languages"]),
                        doctor["location"],
                        json.dumps(doctor["areas"]),
                        1 if doctor["teleconsult"] else 0,
                        doctor["rating"],
                        doctor["profileUrl"],
                    )
                    for doctor in DOCTORS
                ],
            )

        if connection.execute("SELECT COUNT(*) FROM health_centers").fetchone()[0] == 0:
            connection.executemany(
                """
                INSERT INTO health_centers (name, type, address, latitude, longitude, services)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        center["name"],
                        center["type"],
                        center["address"],
                        center["latitude"],
                        center["longitude"],
                        json.dumps(center["services"]),
                    )
                    for center in HEALTH_CENTERS
                ],
            )

        if connection.execute("SELECT COUNT(*) FROM news").fetchone()[0] == 0:
            connection.executemany(
                """
                INSERT INTO news (language, title, description, content, source, date, url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        article["language"],
                        article["title"],
                        article["description"],
                        article["content"],
                        article["source"],
                        article["date"],
                        article["url"],
                    )
                    for article in NEWS
                ],
            )


def load_training_examples() -> list[dict[str, Any]]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT condition, input, urgency, advice, red_flags FROM training_examples ORDER BY id"
        ).fetchall()
    return [
        {
            "condition": row["condition"],
            "input": row["input"],
            "urgency": row["urgency"],
            "advice": json.loads(row["advice"]),
            "red_flags": json.loads(row["red_flags"]),
        }
        for row in rows
    ]


def load_doctors() -> list[dict[str, Any]]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT name, specialization, experience, fee, languages, location, areas, teleconsult, rating, profile_url FROM doctors ORDER BY rating DESC"
        ).fetchall()
    return [
        {
            "name": row["name"],
            "specialization": row["specialization"],
            "experience": row["experience"],
            "fee": row["fee"],
            "languages": json.loads(row["languages"]),
            "location": row["location"],
            "areas": json.loads(row["areas"]),
            "teleconsult": bool(row["teleconsult"]),
            "rating": row["rating"],
            "profileUrl": row["profile_url"],
        }
        for row in rows
    ]


def load_health_centers() -> list[dict[str, Any]]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT name, type, address, latitude, longitude, services FROM health_centers ORDER BY name"
        ).fetchall()
    return [
        {
            "name": row["name"],
            "type": row["type"],
            "address": row["address"],
            "latitude": row["latitude"],
            "longitude": row["longitude"],
            "services": json.loads(row["services"]),
        }
        for row in rows
    ]


def load_news() -> list[dict[str, Any]]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT language, title, description, content, source, date, url FROM news ORDER BY date DESC"
        ).fetchall()
    return [
        {
            "language": row["language"],
            "title": row["title"],
            "description": row["description"],
            "content": row["content"],
            "source": row["source"],
            "date": row["date"],
            "url": row["url"],
        }
        for row in rows
    ]


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s]", " ", text.lower())).strip()


def tokenize(text: str) -> list[str]:
    return [token for token in normalize(text).split() if token and token not in STOP_WORDS]


initialize_database()


def score_example(tokens: list[str], example: dict[str, Any]) -> tuple[int, list[str]]:
    example_tokens = set(tokenize(example["input"]))
    matched = [token for token in tokens if token in example_tokens]
    return len(matched), matched


def analyze(question: str) -> dict[str, Any]:
    tokens = tokenize(question)
    examples = load_training_examples()
    if not tokens:
        return {
            "condition": "general wellness",
            "urgency": "routine",
            "confidence": 0.35,
            "summary": "The offline triage agent needs a few more symptom details to narrow the synthetic training set.",
            "advice": [
                "Describe the main symptom, how long it has lasted, and any fever, pain, or breathing changes.",
                "If the person is very unwell, seek local in-person care immediately.",
            ],
            "red_flags": ["confusion", "fainting", "breathing difficulty"],
            "matched_signals": [],
        }

    ranked = []
    for example in examples:
        score, matched = score_example(tokens, example)
        ranked.append((score, len(example["advice"]), example, matched))

    ranked.sort(key=lambda item: (item[0], item[1]), reverse=True)
    score, _, top_example, matched = ranked[0]
    confidence = min(0.96, 0.5 + score / 10) if score else 0.42
    summary = (
        f"The offline triage agent matched your symptoms most closely with {top_example['condition']}. "
        "It uses synthetic examples bundled with the project and always prioritizes safety checks."
        if score
        else "The offline triage agent could not isolate one condition confidently, so it is returning broad guidance trained from synthetic examples."
    )
    return {
        "condition": top_example["condition"],
        "urgency": top_example["urgency"],
        "confidence": confidence,
        "summary": summary,
        "advice": top_example["advice"],
        "red_flags": top_example["red_flags"],
        "matched_signals": matched[:5],
    }


def score_doctor(condition: str, location: str, doctor: dict[str, Any]) -> tuple[float, list[str]]:
    query = normalize(f"{condition} {location}")
    query_tokens = set(tokenize(query))
    location_tokens = set(tokenize(doctor["location"]))
    score = float(doctor["rating"])
    reasons: list[str] = []

    for area in doctor["areas"]:
        area_tokens = set(tokenize(area))
        if query_tokens.intersection(area_tokens):
            score += 3.0
            reasons.append(f"Matches {area}")

    for language in doctor["languages"]:
        if normalize(language) in query:
            score += 0.8
            reasons.append(f"Speaks {language}")

    if query_tokens.intersection(location_tokens):
        score += 1.5
        reasons.append(f"Near {doctor['location']}")

    if doctor["teleconsult"]:
        score += 0.5
        reasons.append("Teleconsult available")

    return score, reasons


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = math.sin(d_lat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def nearby_centers(latitude: float, longitude: float, facility_type: str = "all") -> list[dict[str, Any]]:
    centers = []
    for center in load_health_centers():
        if facility_type != "all" and center["type"] != facility_type:
            continue
        item = dict(center)
        item["distanceKm"] = haversine_km(latitude, longitude, center["latitude"], center["longitude"])
        centers.append(item)
    return sorted(centers, key=lambda item: item["distanceKm"])


class Handler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code: int = 200) -> None:
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self) -> None:  # noqa: N802
        self._set_headers(200)

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            self._set_headers(200)
            self.wfile.write(
                json.dumps({
                    "status": "ok",
                    "mode": "offline",
                    "database": str(DATABASE_PATH),
                    "engine": "sqlite",
                }).encode("utf-8")
            )
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))

    def do_POST(self) -> None:  # noqa: N802
        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length).decode("utf-8") if length else "{}"
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            payload = {}

        parsed = urlparse(self.path)
        if parsed.path == "/ask":
            self._set_headers(200)
            answer = analyze(str(payload.get("question", "")))
            self.wfile.write(json.dumps({"response": answer["advice"], "summary": answer["summary"], "analysis": answer}).encode("utf-8"))
            return

        if parsed.path == "/doctors":
            condition = str(payload.get("condition", ""))
            location = str(payload.get("location", ""))
            ranked = []
            for doctor in load_doctors():
                score, reasons = score_doctor(condition, location, doctor)
                ranked.append({**doctor, "score": score, "reasons": reasons})
            ranked.sort(key=lambda item: item["score"], reverse=True)
            self._set_headers(200)
            self.wfile.write(json.dumps({"doctors": ranked}).encode("utf-8"))
            return

        if parsed.path == "/health-centers":
            latitude = float(payload.get("latitude", 19.076))
            longitude = float(payload.get("longitude", 72.8777))
            facility_type = str(payload.get("type", "all"))
            centers = nearby_centers(latitude, longitude, facility_type)
            self._set_headers(200)
            self.wfile.write(json.dumps({"nearest_health_centers": centers, "route": {"points": [[latitude, longitude], [centers[0]["latitude"], centers[0]["longitude"]]] if centers else []}}).encode("utf-8"))
            return

        if parsed.path == "/news":
            language = str(payload.get("language", "English"))
            selected = [article for article in load_news() if language.lower() in article["language"].lower()]
            if not selected:
                selected = [article for article in load_news() if article["language"] == "English"]
            self._set_headers(200)
            self.wfile.write(json.dumps({"news": selected, "summary": f"Offline news bundle for {language}", "count": len(selected)}).encode("utf-8"))
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"GramAarogya offline server running at http://127.0.0.1:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
