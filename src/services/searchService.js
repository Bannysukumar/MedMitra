import { SYMPTOM_MAP } from '../config/constants'

export function searchMedicines(query, medicines = []) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const symptomMatches = Object.entries(SYMPTOM_MAP)
    .filter(([symptom]) => symptom.includes(q) || q.includes(symptom))
    .flatMap(([, names]) => names)

  return medicines.filter((med) => {
    const matchesKeyword =
      med.name.toLowerCase().includes(q) ||
      med.genericName.toLowerCase().includes(q) ||
      med.brand.toLowerCase().includes(q) ||
      med.category.toLowerCase().includes(q) ||
      med.symptoms?.some((s) => s.includes(q))

    const matchesSymptomMap = symptomMatches.some(
      (name) =>
        med.name.toLowerCase().includes(name.toLowerCase()) ||
        med.brand.toLowerCase().includes(name.toLowerCase())
    )

    return matchesKeyword || matchesSymptomMap
  })
}

export function searchBySymptom(symptom, medicines = []) {
  const key = symptom.trim().toLowerCase()
  const suggestedNames = SYMPTOM_MAP[key] || []
  const fromSymptoms = medicines.filter((m) => m.symptoms?.includes(key))
  const fromMap = medicines.filter((m) =>
    suggestedNames.some(
      (n) =>
        m.name.toLowerCase().includes(n.toLowerCase()) ||
        m.brand.toLowerCase().includes(n.toLowerCase())
    )
  )
  const combined = [...fromSymptoms, ...fromMap]
  return [...new Map(combined.map((m) => [m.id, m])).values()]
}

export function getSymptomSuggestions() {
  return Object.keys(SYMPTOM_MAP)
}
