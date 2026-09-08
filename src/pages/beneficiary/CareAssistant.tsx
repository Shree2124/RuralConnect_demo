import React, { useState } from "react";
import { AlertTriangle, CheckCircle, ChevronRight, Mic, Upload, AlertCircle, ArrowRight, Info } from "lucide-react";
import { Card, Button, Badge } from "../../components/ui";
import { cn } from "../../lib/utils";

type Severity = "low" | "moderate" | "high" | null;

const SYMPTOMS = [
  { id: "fever", label: "Fever", icon: "🌡️" },
  { id: "cough", label: "Cough", icon: "😮‍💨" },
  { id: "headache", label: "Headache", icon: "🤕" },
  { id: "breathing", label: "Difficulty breathing", icon: "😮" },
  { id: "injury", label: "Injury", icon: "🩹" },
  { id: "stomach", label: "Stomach pain", icon: "🫃" },
  { id: "weakness", label: "Weakness", icon: "😴" },
  { id: "vomiting", label: "Vomiting", icon: "🤢" },
  { id: "chest_pain", label: "Chest pain", icon: "💗" },
  { id: "dizziness", label: "Dizziness", icon: "😵‍💫" },
  { id: "skin", label: "Skin problems", icon: "🩻" },
  { id: "other", label: "Other", icon: "❓" },
];

const DURATION_OPTIONS = ["Today", "1-2 days", "3-5 days", "More than 5 days", "More than 2 weeks"];

const ASSESSMENT_MAP: Record<string, { severity: Severity; urgency: string; service: string; steps: string[] }> = {
  high: {
    severity: "high",
    urgency: "HIGH — Possible urgent medical attention required",
    service: "CHC / District Hospital",
    steps: [
      "Please seek urgent medical attention immediately.",
      "Visit the nearest CHC or District Hospital.",
      "Contact a healthcare provider or field worker.",
      "Do not delay if symptoms are severe.",
    ],
  },
  moderate: {
    severity: "moderate",
    urgency: "MODERATE — Medical evaluation recommended",
    service: "PHC / Ayushman Arogya Mandir",
    steps: [
      "Visit your nearest PHC or Ayushman Arogya Mandir.",
      "Consult a healthcare provider within 24 hours.",
      "Stay hydrated and rest.",
    ],
  },
  low: {
    severity: "low",
    urgency: "LOW — Self-care may be appropriate",
    service: "Ayushman Arogya Mandir / Sub-Centre",
    steps: [
      "Monitor symptoms carefully.",
      "Visit Ayushman Arogya Mandir if symptoms persist.",
      "Consult a field worker if you need guidance.",
    ],
  },
};

export default function CareAssistant() {
  const [selected, setSelected] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [step, setStep] = useState<"input" | "result">("input");
  const [assessment, setAssessment] = useState<typeof ASSESSMENT_MAP["high"] | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const getSeverity = (): "high" | "moderate" | "low" => {
    if (selected.includes("breathing") || selected.includes("chest_pain")) return "high";
    if (selected.length >= 3 || selected.includes("vomiting")) return "moderate";
    return "low";
  };

  const handleAssess = () => {
    const sev = getSeverity();
    setAssessment(ASSESSMENT_MAP[sev]);
    setStep("result");
  };

  const resetAssistant = () => {
    setSelected([]);
    setDuration("");
    setStep("input");
    setAssessment(null);
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      {/* Safety Disclaimer */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3">
        <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-blue-800">Non-Diagnostic Care Guidance</p>
          <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
            This tool provides <strong>symptom-based service routing</strong> only. It does <strong>NOT diagnose</strong> any medical condition. 
            Always consult a qualified healthcare professional for medical advice.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-800">Care Assistant</h1>
        <p className="text-slate-500 text-sm mt-0.5">Tell us what you're experiencing to get care guidance</p>
      </div>

      {step === "input" ? (
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">What are you experiencing?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SYMPTOMS.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleSymptom(s.id)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all text-left",
                    selected.includes(s.id)
                      ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  )}
                >
                  <span>{s.icon}</span>
                  <span className="text-xs">{s.label}</span>
                  {selected.includes(s.id) && <CheckCircle size={12} className="ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>

            {/* Voice Input UI */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2">Or use voice input</p>
              <button
                onClick={() => setVoiceActive(!voiceActive)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                  voiceActive ? "bg-red-600 text-white border-red-700" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
              >
                <Mic size={15} className={voiceActive ? "animate-pulse" : ""} />
                {voiceActive ? "Recording... (Demo)" : "Start Voice Input"}
              </button>
              {voiceActive && (
                <p className="text-[10px] text-slate-400 mt-1">Voice input simulation — not functional in prototype</p>
              )}
            </div>
          </Card>

          {/* Duration */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">How long have you had these symptoms?</h2>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    duration === d ? "bg-blue-600 text-white border-blue-700" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </Card>

          {/* Upload */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Attach Report (Optional)</h2>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 hover:border-blue-300 hover:bg-blue-50 transition-all w-full justify-center">
              <Upload size={16} />
              Upload medical report or image
            </button>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">Simulated upload — no files are actually stored</p>
          </Card>

          <Button
            variant="primary"
            className="w-full justify-center py-3"
            onClick={handleAssess}
            disabled={selected.length === 0}
          >
            Get Care Guidance
            <ArrowRight size={16} />
          </Button>

          {selected.length === 0 && (
            <p className="text-xs text-slate-400 text-center">Please select at least one symptom to continue</p>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {/* Severity Card */}
          <div className={cn(
            "p-5 rounded-xl border-2",
            assessment?.severity === "high" ? "bg-red-50 border-red-300" :
            assessment?.severity === "moderate" ? "bg-amber-50 border-amber-300" : "bg-emerald-50 border-emerald-300"
          )}>
            <div className="flex items-start gap-3">
              {assessment?.severity === "high" ? (
                <AlertTriangle size={22} className="text-red-600 flex-shrink-0 mt-0.5" />
              ) : assessment?.severity === "moderate" ? (
                <AlertCircle size={22} className="text-amber-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle size={22} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={cn("text-sm font-bold",
                  assessment?.severity === "high" ? "text-red-800" :
                  assessment?.severity === "moderate" ? "text-amber-800" : "text-emerald-800"
                )}>
                  Urgency Assessment
                </p>
                <p className={cn("text-xs font-semibold mt-1",
                  assessment?.severity === "high" ? "text-red-700" :
                  assessment?.severity === "moderate" ? "text-amber-700" : "text-emerald-700"
                )}>
                  {assessment?.urgency}
                </p>
                <p className="text-[10px] text-slate-600 mt-2 italic">
                  ⚠️ This is NOT a medical diagnosis. This assessment is based on the information you provided and is for service routing only.
                </p>
              </div>
            </div>
          </div>

          {/* Reported Symptoms */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Reported Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {selected.map(s => (
                <span key={s} className="badge-blue text-xs">
                  {SYMPTOMS.find(sym => sym.id === s)?.label}
                </span>
              ))}
              {duration && <span className="badge-gray text-xs">Duration: {duration}</span>}
            </div>
          </Card>

          {/* Recommended Service */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Recommended Next Step</h3>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-3">
              <p className="text-xs font-semibold text-blue-800">Recommended healthcare service:</p>
              <p className="text-sm font-bold text-blue-700 mt-1">{assessment?.service}</p>
            </div>
            <div className="space-y-2">
              {assessment?.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </Card>

          {/* Safety Note */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Important:</strong> If you are unable to reach a healthcare facility or if symptoms worsen significantly, 
              please contact your field worker or call your local emergency health number. 
              <br /><br />
              This platform does NOT replace professional medical consultation.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" className="flex-1 justify-center" onClick={() => {}}>
              Find Nearest {assessment?.service}
            </Button>
            <Button variant="secondary" onClick={resetAssistant}>
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
