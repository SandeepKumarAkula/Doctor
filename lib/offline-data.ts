export type HeroMessage = {
  lang: string
  text: string
}

export type FeatureCard = {
  title: string
  description: string
  badge: string
}

export type DoctorProfile = {
  name: string
  specialization: string
  experience: string
  fee: string
  languages: string[]
  location: string
  areas: string[]
  teleconsult: boolean
  rating: number
  profileUrl: string
}

export type HealthCenter = {
  name: string
  type: string
  address: string
  latitude: number
  longitude: number
  services: string[]
}

export type NewsArticle = {
  title: string
  description: string
  content: string
  source: string
  date: string
  url: string
  language: string
}

export type InsightSeriesPoint = {
  year: number
  urban: number
  rural: number
}

export type InsightCategory = {
  label: string
  urban: number
  rural: number
}

export type TeamMember = {
  name: string
  role: string
  bio: string
  focus: string
}

export type TrainingExample = {
  condition: string
  input: string
  urgency: "routine" | "soon" | "urgent"
  advice: string[]
  redFlags: string[]
}

export const heroMessages: HeroMessage[] = [
  { lang: "English", text: "AI healthcare that works offline-first" },
  { lang: "हिन्दी", text: "ऑफलाइन-प्रथम स्वास्थ्य सहायक" },
  { lang: "ગુજરાતી", text: "ઓફલાઇન-પ્રથમ આરોગ્ય સહાયક" },
  { lang: "বাংলা", text: "অফলাইন-প্রথম স্বাস্থ্য সহায়ক" },
  { lang: "मराठी", text: "ऑफलाइन-प्रथम आरोग्य सहाय्यक" },
  { lang: "தமிழ்", text: "ஆஃப்லைன்-முதல் ஆரோக்கிய உதவியாளர்" },
]

export const featureCards: FeatureCard[] = [
  {
    title: "Synthetic AI Triage",
    description:
      "A local symptom engine trained on synthetic examples ranks likely conditions, urgency, and self-care steps without external model calls.",
    badge: "Agent 01",
  },
  {
    title: "Doctor Matching",
    description:
      "Search against a built-in doctor registry by condition, fee, language, and distance to surface realistic referrals.",
    badge: "Agent 02",
  },
  {
    title: "Offline Health News",
    description:
      "Curated multilingual health briefs are bundled with the app so communities can read updates even when connectivity is limited.",
    badge: "Agent 03",
  },
  {
    title: "Regional Insights",
    description:
      "Charts and local narratives turn public health indicators into actionable stories for planning and outreach.",
    badge: "Agent 04",
  },
]

export const doctorProfiles: DoctorProfile[] = [
  {
    name: "Dr. Asha Kulkarni",
    specialization: "Family Medicine",
    experience: "14 years",
    fee: "Rs. 300",
    languages: ["English", "Marathi", "Hindi"],
    location: "Pune, Maharashtra",
    areas: ["fever", "cough", "diabetes", "blood pressure"],
    teleconsult: true,
    rating: 4.9,
    profileUrl: "https://example.com/doctors/asha-kulkarni",
  },
  {
    name: "Dr. Imran Shaikh",
    specialization: "General Physician",
    experience: "11 years",
    fee: "Rs. 250",
    languages: ["English", "Hindi", "Gujarati"],
    location: "Surat, Gujarat",
    areas: ["stomach pain", "dehydration", "fever", "vomiting"],
    teleconsult: true,
    rating: 4.8,
    profileUrl: "https://example.com/doctors/imran-shaikh",
  },
  {
    name: "Dr. Nandini Rao",
    specialization: "Paediatrics",
    experience: "16 years",
    fee: "Rs. 500",
    languages: ["English", "Hindi", "Tamil"],
    location: "Chennai, Tamil Nadu",
    areas: ["child health", "vaccination", "fever", "nutrition"],
    teleconsult: false,
    rating: 4.9,
    profileUrl: "https://example.com/doctors/nandini-rao",
  },
  {
    name: "Dr. Farah Khan",
    specialization: "Dermatology",
    experience: "9 years",
    fee: "Rs. 450",
    languages: ["English", "Hindi", "Urdu"],
    location: "Lucknow, Uttar Pradesh",
    areas: ["skin rash", "allergy", "itching", "infection"],
    teleconsult: true,
    rating: 4.7,
    profileUrl: "https://example.com/doctors/farah-khan",
  },
  {
    name: "Dr. Prakash Mehta",
    specialization: "Internal Medicine",
    experience: "19 years",
    fee: "Rs. 600",
    languages: ["English", "Hindi"],
    location: "Indore, Madhya Pradesh",
    areas: ["diabetes", "fatigue", "hypertension", "chest pain"],
    teleconsult: false,
    rating: 4.95,
    profileUrl: "https://example.com/doctors/prakash-mehta",
  },
  {
    name: "Dr. Sanya Bose",
    specialization: "Community Health",
    experience: "8 years",
    fee: "Rs. 200",
    languages: ["English", "Bengali", "Hindi"],
    location: "Kolkata, West Bengal",
    areas: ["fever", "pregnancy care", "nutrition", "child health"],
    teleconsult: true,
    rating: 4.85,
    profileUrl: "https://example.com/doctors/sanya-bose",
  },
]

export const healthCenters: HealthCenter[] = [
  {
    name: "Gram Aarogya Wellness Center",
    type: "public",
    address: "Sector 12, Navi Mumbai",
    latitude: 19.033,
    longitude: 73.029,
    services: ["primary care", "immunization", "maternal health"],
  },
  {
    name: "Saksham Rural Clinic",
    type: "clinic",
    address: "Hinjewadi, Pune",
    latitude: 18.591,
    longitude: 73.737,
    services: ["family medicine", "basic labs", "teleconsult"],
  },
  {
    name: "Jan Arogya Hospital",
    type: "private",
    address: "Banjara Hills, Hyderabad",
    latitude: 17.412,
    longitude: 78.449,
    services: ["emergency", "internal medicine", "paediatrics"],
  },
  {
    name: "Niramaya Health Post",
    type: "public",
    address: "Salt Lake, Kolkata",
    latitude: 22.585,
    longitude: 88.459,
    services: ["vaccination", "antenatal care", "screening"],
  },
  {
    name: "Aarogya Seva Medical Hub",
    type: "medical",
    address: "T Nagar, Chennai",
    latitude: 13.042,
    longitude: 80.238,
    services: ["pharmacy", "diagnostics", "urgent care"],
  },
  {
    name: "Sehat Sathi Clinic",
    type: "clinic",
    address: "Vijay Nagar, Indore",
    latitude: 22.753,
    longitude: 75.896,
    services: ["general consultation", "diabetes care", "blood pressure check"],
  },
]

export const newsArticles: NewsArticle[] = [
  {
    language: "English",
    title: "Rural screening camps expand across five districts",
    description: "Local health workers are bringing blood pressure and diabetes checks to weekly village camps.",
    content:
      "The latest outreach program pairs mobile nurses with community volunteers so residents can receive quick screenings, medication guidance, and referral support before conditions become emergencies.",
    source: "GramAarogya Desk",
    date: "2026-04-05T08:15:00Z",
    url: "https://example.com/news/rural-screening-camps",
  },
  {
    language: "English",
    title: "Synthetic triage agent flags dehydration early",
    description: "An offline assistant now detects dehydration patterns from short symptom inputs and recommends next steps.",
    content:
      "The agent was trained on synthetic symptom phrases and can now suggest oral rehydration, rest, and when to escalate to a clinician. The emphasis remains on safety and quick local action.",
    source: "Health Systems Lab",
    date: "2026-04-03T10:00:00Z",
    url: "https://example.com/news/dehydration-agent",
  },
  {
    language: "Hindi",
    title: "गांवों में पोषण जांच शिविरों का विस्तार",
    description: "स्थानीय स्वास्थ्यकर्मी नियमित शिविरों में रक्तचाप और मधुमेह जांच उपलब्ध करा रहे हैं।",
    content:
      "यह कार्यक्रम समुदाय स्वयंसेवकों के साथ मोबाइल नर्सों को जोड़ता है, ताकि लोग समय पर जांच, दवा सलाह और रेफरल सहायता प्राप्त कर सकें।",
    source: "ग्रामआरोग्य डेस्क",
    date: "2026-04-04T09:30:00Z",
    url: "https://example.com/news/hindi-screening",
  },
  {
    language: "Gujarati",
    title: "ગ્રામિણ આરોગ્ય સહાય માટે નવા માર્ગદર્શિકા બહાર પડી",
    description: "સ્થાનિક આરોગ્ય કેન્દ્રોને પ્રાથમિક તપાસ અને તાત્કાલિક સંદર્ભ માટે નવા માર્ગદર્શન મળ્યા છે.",
    content:
      "આ માર્ગદર્શિકામાં લક્ષણ આધારિત વહેલી ઓળખ, ડાયાબિટીસ દેખરેખ, અને બાળકોના પોષણ માટે ઝડપી સંદર્ભ પગલાં સમાવાયા છે.",
    source: "Aarogya Brief",
    date: "2026-04-02T06:45:00Z",
    url: "https://example.com/news/gujarati-guide",
  },
  {
    language: "Tamil",
    title: "ஆஃப்லைன் உதவியாளர்கள் கிராம சுகாதாரத்தை விரிவாக்குகின்றனர்",
    description: "தொலைநிலை பகுதிகளில் அறிகுறி அடிப்படையிலான வழிகாட்டல் இப்போது உள்ளூர் சாதனங்களில் இயங்குகிறது.",
    content:
      "சீரமைக்கப்பட்ட சோதனை தரவின் மூலம் பயிற்றப்பட்ட உதவியாளர்கள், பொதுவான அறிகுறிகளுக்கு முன்னுரிமை அளித்து, நம்பகமான அடுத்த படிகளை பரிந்துரைக்கின்றனர்.",
    source: "Health Grid Tamil",
    date: "2026-04-01T11:20:00Z",
    url: "https://example.com/news/tamil-assistant",
  },
]

export const insightSeries: InsightSeriesPoint[] = [
  { year: 2015, urban: 67.2, rural: 61.1 },
  { year: 2017, urban: 68.1, rural: 62.4 },
  { year: 2019, urban: 69.4, rural: 64.3 },
  { year: 2021, urban: 70.2, rural: 65.1 },
  { year: 2023, urban: 71.1, rural: 66.5 },
  { year: 2025, urban: 71.8, rural: 67.4 },
]

export const conditionBreakdown: InsightCategory[] = [
  { label: "Respiratory", urban: 22, rural: 31 },
  { label: "Gastrointestinal", urban: 17, rural: 24 },
  { label: "Hypertension", urban: 28, rural: 21 },
  { label: "Maternal Care", urban: 14, rural: 23 },
  { label: "Child Nutrition", urban: 19, rural: 27 },
]

export const mortalitySeries: InsightSeriesPoint[] = [
  { year: 2015, urban: 29, rural: 48 },
  { year: 2017, urban: 27, rural: 44 },
  { year: 2019, urban: 24, rural: 40 },
  { year: 2021, urban: 22, rural: 36 },
  { year: 2023, urban: 20, rural: 33 },
  { year: 2025, urban: 18, rural: 30 },
]

export const careAccessSeries: InsightSeriesPoint[] = [
  { year: 2015, urban: 83, rural: 58 },
  { year: 2017, urban: 85, rural: 61 },
  { year: 2019, urban: 87, rural: 64 },
  { year: 2021, urban: 89, rural: 67 },
  { year: 2023, urban: 91, rural: 70 },
  { year: 2025, urban: 93, rural: 73 },
]

export const teamMembers: TeamMember[] = [
  {
    name: "Siddharth Mishra",
    role: "AI Systems Lead",
    bio: "Architects the offline symptom engine and the synthetic training pipeline that keeps the assistant safe and local.",
    focus: "Synthetic AI agents",
  },
  {
    name: "Manoday Kadam",
    role: "Platform Engineer",
    bio: "Maintains the routing, data model, and deployment path so the app can run without external service dependencies.",
    focus: "Infrastructure and delivery",
  },
  {
    name: "Prachiti Palande",
    role: "Product Designer",
    bio: "Shapes the information hierarchy, motion, and readability for low-bandwidth, mobile-first healthcare journeys.",
    focus: "UX and accessibility",
  },
  {
    name: "Priyadarshini Chavan",
    role: "Frontend Engineer",
    bio: "Builds the local interface components, interaction states, and chart visualizations from plain React and CSS.",
    focus: "Frontend systems",
  },
]

export const trainingExamples: TrainingExample[] = [
  {
    condition: "dehydration",
    input: "feels dizzy with dry mouth after vomiting and not drinking water",
    urgency: "soon",
    advice: ["Sip oral rehydration solution or clean water in small amounts.", "Rest in a cool place and avoid heavy meals.", "If confusion, fainting, or very little urine appears, seek urgent care."],
    redFlags: ["confusion", "fainting", "no urine", "persistent vomiting"],
  },
  {
    condition: "respiratory infection",
    input: "fever, sore throat, cough, and body ache for two days",
    urgency: "routine",
    advice: ["Rest, hydrate, and monitor temperature.", "Use masks around others and keep distance until symptoms ease.", "If breathing becomes hard or fever stays high, consult a clinician."],
    redFlags: ["breathing difficulty", "chest pain", "bluish lips"],
  },
  {
    condition: "stomach illness",
    input: "stomach pain, loose motions, and nausea after street food",
    urgency: "soon",
    advice: ["Drink fluids often and keep meals light.", "Avoid oily food for a day or two.", "If blood in stool, severe pain, or dehydration appears, get checked."],
    redFlags: ["blood in stool", "severe pain", "dehydration"],
  },
  {
    condition: "blood sugar concern",
    input: "thirst, frequent urination, fatigue, and blurred vision",
    urgency: "urgent",
    advice: ["Arrange a blood sugar check as soon as possible.", "Keep hydrated and avoid sugary drinks until reviewed.", "If drowsiness or vomiting develops, seek urgent medical help."],
    redFlags: ["drowsiness", "vomiting", "rapid breathing"],
  },
  {
    condition: "skin irritation",
    input: "itchy red rash on arms after working in the field",
    urgency: "routine",
    advice: ["Wash the skin gently and keep it dry.", "Avoid scratching and watch for spreading rash.", "If swelling, fever, or pus appears, consult a doctor."],
    redFlags: ["swelling", "fever", "pus"],
  },
]
