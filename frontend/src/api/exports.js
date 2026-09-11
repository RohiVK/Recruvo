import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Helper to trigger browser download
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 1. Export Single Candidate Report as PDF
export function exportSingleCandidatePDF({ candidate, screening, job }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const c = candidate?.resume || candidate || {};
  const s = screening || {};
  const j = job?.job_description || job || {};

  const name = c.name || "Candidate Report";
  const role = c.experience?.[0]?.role || "Candidate";
  const scorePct = s.score ? `${Math.round(s.score * 10)}%` : "N/A";

  // Header Banner
  doc.setFillColor(15, 23, 42); // Dark slate
  doc.rect(0, 0, 595.28, 90, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("RECRUVO CANDIDATE ANALYSIS", 40, 42);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Smarter Hiring. Brighter Teams.", 40, 60);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 450, 60);

  // Candidate Overview Card
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(name, 40, 125);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`${role}  |  ${c.email || "N/A"}  |  ${c.phone || "N/A"}  |  ${c.location || "N/A"}`, 40, 145);
  if (j.title) {
    doc.text(`Position Evaluated: ${j.title} (${j.company || "Company"})`, 40, 162);
  }

  // Score Badge
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(420, 110, 135, 60, 6, 6, "F");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("OVERALL MATCH", 445, 130);
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235);
  doc.text(scorePct, 460, 155);

  // Score Breakdown Table
  const tableData = [
    ["Overall Match", scorePct, s.reason || "Holistic alignment assessment"],
    ["Technical Skills", s.technicalScore ? `${s.technicalScore * 10}%` : scorePct, "Matches core technical competencies"],
    ["Work Experience", s.experienceScore ? `${s.experienceScore * 10}%` : scorePct, "Relevant industry tenure and roles"],
    ["Education", s.educationScore ? `${s.educationScore * 10}%` : scorePct, "Academic degree and field alignment"],
    ["Projects & Portfolio", s.projectScore ? `${s.projectScore * 10}%` : scorePct, "Applied domain execution and projects"],
  ];

  autoTable(doc, {
    startY: 185,
    head: [["Evaluation Dimension", "Score", "Assessment Insight"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 6 },
    columnStyles: { 0: { cellWidth: 140, fontStyle: "bold" }, 1: { cellWidth: 70, halign: "center" } },
  });

  let currentY = doc.lastAutoTable.finalY + 20;

  // AI Executive Summary
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("AI Executive Summary", 40, currentY);
  currentY += 14;

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(s.summary || s.reason || "Candidate has demonstrated relevant technical capabilities.", 515);
  doc.text(summaryLines, 40, currentY);
  currentY += summaryLines.length * 13 + 15;

  // Matching & Missing Skills
  const matching = (s.matchingSkills || []).slice(0, 8).join(", ") || "None specified";
  const missing = (s.missingSkills || []).slice(0, 8).join(", ") || "None identified";

  autoTable(doc, {
    startY: currentY,
    head: [["Skill Category", "Skills Identified"]],
    body: [
      ["Matching Skills", matching],
      ["Missing / Gap Skills", missing],
    ],
    theme: "grid",
    headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 6 },
    columnStyles: { 0: { cellWidth: 140, fontStyle: "bold" } },
  });

  currentY = doc.lastAutoTable.finalY + 18;

  // Strengths & Weaknesses
  if (currentY < 720) {
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Key Strengths & Interview Focus", 40, currentY);
    currentY += 14;

    const strengthsList = (s.strengths || []).map((str) => `• ${str}`).join("\n") || "• Strong technical background";
    const weaknessesList = (s.weaknesses || []).map((w) => `• ${w}`).join("\n") || "• Assess depth in missing skills";

    autoTable(doc, {
      startY: currentY,
      head: [["Key Strengths", "Areas to Probe / Caution"]],
      body: [[strengthsList, weaknessesList]],
      theme: "plain",
      styles: { fontSize: 8.5, cellPadding: 5 },
    });
  }

  // Footer Note
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Recruvo AI Decision Support Report — Confidential", 40, 810);

  const cleanFilename = `${(c.name || "candidate").toLowerCase().replace(/[^a-z0-9]/g, "_")}_analysis_report.pdf`;
  doc.save(cleanFilename);
}

// 2. Export Comparison Report as PDF
export function exportComparisonPDF({ candidateA, screeningA, candidateB, screeningB, job }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const cA = candidateA?.resume || candidateA || {};
  const cB = candidateB?.resume || candidateB || {};
  const sA = screeningA || {};
  const sB = screeningB || {};
  const j = job?.job_description || job || {};

  const nameA = cA.name || "Candidate A";
  const nameB = cB.name || "Candidate B";

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 595.28, 85, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("RECRUVO CANDIDATE COMPARISON", 40, 38);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Role: ${j.title || "Target Role"}  |  Date: ${new Date().toLocaleDateString()}`, 40, 58);

  // Comparison Matrix Table
  const compData = [
    ["Overall Match", `${Math.round((sA.score || 0) * 10)}%`, `${Math.round((sB.score || 0) * 10)}%`],
    ["Technical Skills", `${Math.round((sA.technicalScore || sA.score || 0) * 10)}%`, `${Math.round((sB.technicalScore || sB.score || 0) * 10)}%`],
    ["Experience Level", `${Math.round((sA.experienceScore || sA.score || 0) * 10)}%`, `${Math.round((sB.experienceScore || sB.score || 0) * 10)}%`],
    ["Education", `${Math.round((sA.educationScore || sA.score || 0) * 10)}%`, `${Math.round((sB.educationScore || sB.score || 0) * 10)}%`],
    ["Projects Alignment", `${Math.round((sA.projectScore || sA.score || 0) * 10)}%`, `${Math.round((sB.projectScore || sB.score || 0) * 10)}%`],
    [
      "Matching Skills",
      (sA.matchingSkills || []).slice(0, 5).join(", ") || "None",
      (sB.matchingSkills || []).slice(0, 5).join(", ") || "None",
    ],
    [
      "Missing Skills",
      (sA.missingSkills || []).slice(0, 4).join(", ") || "None",
      (sB.missingSkills || []).slice(0, 4).join(", ") || "None",
    ],
    [
      "Key Strengths",
      (sA.strengths || []).slice(0, 3).join("\n• ") ? `• ${(sA.strengths || []).slice(0, 3).join("\n• ")}` : "Standard profile",
      (sB.strengths || []).slice(0, 3).join("\n• ") ? `• ${(sB.strengths || []).slice(0, 3).join("\n• ")}` : "Standard profile",
    ],
  ];

  autoTable(doc, {
    startY: 110,
    head: [["Evaluation Criteria", nameA, nameB]],
    body: compData,
    theme: "grid",
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 9, cellPadding: 6 },
    columnStyles: {
      0: { cellWidth: 120, fontStyle: "bold" },
      1: { cellWidth: 195 },
      2: { cellWidth: 195 },
    },
  });

  let currentY = doc.lastAutoTable.finalY + 20;

  // Comparison Summary
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("AI Comparison Summary & Trade-offs", 40, currentY);
  currentY += 15;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const summaryText = `${nameA} scored ${Math.round((sA.score || 0) * 10)}% vs ${nameB} with ${Math.round((sB.score || 0) * 10)}% overall match for this role. ${
    (sA.score || 0) >= (sB.score || 0)
      ? `${nameA} demonstrates higher alignment in core technical requirements.`
      : `${nameB} demonstrates higher alignment in core technical requirements.`
  } Evaluate interview questions and team requirements when making final recruiter decisions.`;

  const compSummaryLines = doc.splitTextToSize(summaryText, 510);
  doc.text(compSummaryLines, 40, currentY);

  // Footer Note
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Recruvo AI Comparison Matrix — Generated for Decision Support", 40, 810);

  const cleanFilename = `comparison_${(cA.name || "candidateA").toLowerCase().replace(/[^a-z0-9]/g, "_")}_vs_${(cB.name || "candidateB").toLowerCase().replace(/[^a-z0-9]/g, "_")}.pdf`;
  doc.save(cleanFilename);
}

// 3. Export All / Filtered Results as CSV
export function exportResultsCSV({ candidates, screenings, job, filterType = "all", topN = 10, selectedIds = [] }) {
  let list = candidates.map((cand) => {
    const c = cand.resume || cand;
    const s = (screenings || []).find((sc) => sc.resume_id === cand.id) || {};
    return {
      id: cand.id,
      name: c.name || "Candidate",
      role: c.experience?.[0]?.role || "Candidate",
      email: c.email || "",
      phone: c.phone || "",
      location: c.location || "",
      score: s.score ? s.score * 10 : 0,
      technicalScore: s.technicalScore ? s.technicalScore * 10 : (s.score ? s.score * 10 : ""),
      experienceScore: s.experienceScore ? s.experienceScore * 10 : (s.score ? s.score * 10 : ""),
      educationScore: s.educationScore ? s.educationScore * 10 : (s.score ? s.score * 10 : ""),
      projectScore: s.projectScore ? s.projectScore * 10 : (s.score ? s.score * 10 : ""),
      matchingSkills: Array.isArray(s.matchingSkills) ? s.matchingSkills.join("; ") : "",
      missingSkills: Array.isArray(s.missingSkills) ? s.missingSkills.join("; ") : "",
      strengths: Array.isArray(s.strengths) ? s.strengths.join("; ") : "",
      weaknesses: Array.isArray(s.weaknesses) ? s.weaknesses.join("; ") : "",
      reason: s.reason || "",
      summary: s.summary || s.reason || "",
    };
  });

  // Apply filters
  if (filterType === "top") {
    list.sort((a, b) => b.score - a.score);
    list = list.slice(0, Number(topN) || 10);
  } else if (filterType === "custom" && selectedIds.length > 0) {
    list = list.filter((item) => selectedIds.includes(item.id));
  }

  // Build CSV string
  const headers = [
    "Candidate ID",
    "Candidate Name",
    "Role / Headline",
    "Email",
    "Phone",
    "Location",
    "Overall Match (%)",
    "Technical Score (%)",
    "Experience Score (%)",
    "Education Score (%)",
    "Project Score (%)",
    "Matching Skills",
    "Missing Skills",
    "Strengths",
    "Weaknesses",
    "AI Summary",
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = list.map((item) => [
    escapeCSV(item.id),
    escapeCSV(item.name),
    escapeCSV(item.role),
    escapeCSV(item.email),
    escapeCSV(item.phone),
    escapeCSV(item.location),
    escapeCSV(item.score ? `${item.score}%` : ""),
    escapeCSV(item.technicalScore ? `${item.technicalScore}%` : ""),
    escapeCSV(item.experienceScore ? `${item.experienceScore}%` : ""),
    escapeCSV(item.educationScore ? `${item.educationScore}%` : ""),
    escapeCSV(item.projectScore ? `${item.projectScore}%` : ""),
    escapeCSV(item.matchingSkills),
    escapeCSV(item.missingSkills),
    escapeCSV(item.strengths),
    escapeCSV(item.weaknesses),
    escapeCSV(item.summary),
  ]);

  const csvContent = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const jobTitle = (job?.job_description?.title || "recruvo").toLowerCase().replace(/[^a-z0-9]/g, "_");
  const filename = `recruvo_analysis_${jobTitle}_${new Date().toISOString().slice(0, 10)}.csv`;

  downloadBlob(blob, filename);
}
