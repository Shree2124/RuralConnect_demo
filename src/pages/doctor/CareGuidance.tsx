import React from "react";
import { BookOpen, Stethoscope, Heart, Baby, Eye, Pill } from "lucide-react";
import { Card } from "../../components/ui";

const GUIDANCE = [
  {
    icon: <Stethoscope size={20} className="text-blue-600" />,
    title: "Malaria Diagnosis Protocol",
    category: "Tropical Disease",
    color: "bg-blue-50 border-blue-100",
    steps: [
      "Check for fever >38°C, chills, headache, muscle ache",
      "Conduct RDT (Rapid Diagnostic Test) for malaria antigen",
      "If RDT positive: prescribe Artemisinin-based Combination Therapy (ACT)",
      "Severe cases (altered consciousness, severe anaemia): refer immediately to District Hospital",
      "Follow up in 48 hours to assess treatment response",
    ],
  },
  {
    icon: <Heart size={20} className="text-red-600" />,
    title: "Hypertension Management",
    category: "Non-communicable Disease",
    color: "bg-red-50 border-red-100",
    steps: [
      "BP ≥140/90 on 2 separate readings = Hypertension",
      "Lifestyle counselling: low salt, exercise, no smoking",
      "First-line: Amlodipine 5mg OD or Enalapril 5mg BD",
      "Monitor BP monthly; if uncontrolled after 3 months, add second agent",
      "Refer to CHC/District Hospital for BP >180/110 or end-organ damage",
    ],
  },
  {
    icon: <Pill size={20} className="text-purple-600" />,
    title: "Antibiotic Stewardship",
    category: "Infection Control",
    color: "bg-purple-50 border-purple-100",
    steps: [
      "Do NOT prescribe antibiotics for viral URTI, common cold, or flu",
      "For suspected bacterial infections: take culture before prescribing if possible",
      "Amoxicillin 500mg TID × 5 days for community-acquired pneumonia (mild)",
      "Azithromycin 500mg OD × 3 days for atypical pneumonia",
      "Complete full course; educate patient on compliance",
    ],
  },
  {
    icon: <Baby size={20} className="text-teal-600" />,
    title: "Antenatal Care (ANC) Protocol",
    category: "Maternal Health",
    color: "bg-teal-50 border-teal-100",
    steps: [
      "Minimum 8 ANC visits as per National Health Mission guidelines",
      "Distribute Iron Folic Acid (IFA) tablets from first trimester",
      "Screen for anaemia (Hb < 11g/dL), gestational diabetes, hypertension",
      "Tetanus Toxoid (TT) vaccination at first contact and 4 weeks later",
      "High-risk pregnancies: refer to CHC/District Hospital immediately",
    ],
  },
  {
    icon: <Eye size={20} className="text-amber-600" />,
    title: "Diabetes Management",
    category: "Non-communicable Disease",
    color: "bg-amber-50 border-amber-100",
    steps: [
      "Fasting glucose ≥126 mg/dL or random ≥200 mg/dL = Diabetes",
      "Lifestyle: low glycaemic diet, 30 min exercise daily",
      "First-line drug: Metformin 500mg BD with meals (if no renal impairment)",
      "Target HbA1c <7% for most patients, <8% for elderly",
      "Monitor HbA1c every 3 months; check feet and eyes annually",
    ],
  },
  {
    icon: <BookOpen size={20} className="text-emerald-600" />,
    title: "DOTS (TB Treatment) Protocol",
    category: "Tuberculosis",
    color: "bg-emerald-50 border-emerald-100",
    steps: [
      "Suspect TB: cough >2 weeks, fever, night sweats, weight loss",
      "Initiate sputum microscopy (2 samples) and Xpert MTB/RIF test",
      "Confirmed TB: Register under NIKSHAY, initiate DOTS",
      "Intensive phase: 2 months HRZE; Continuation: 4 months HR",
      "Default follow-up monthly; report adverse effects (hepatotoxicity)",
    ],
  },
];

export default function DoctorCareGuidance() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Care Guidance</h1>
        <p className="text-slate-500 text-sm mt-0.5">Evidence-based clinical protocols for rural primary care settings.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {GUIDANCE.map(g => (
          <Card key={g.title} className={`p-5 border ${g.color}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">{g.icon}</div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">{g.title}</h3>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{g.category}</span>
              </div>
            </div>
            <ol className="space-y-2">
              {g.steps.map((step, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
    </div>
  );
}
