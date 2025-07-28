import React, { useEffect, useState } from "react";
import { getGradeFromMarks, gradeList } from "./gradelist"; // Assuming gradelist.js is correctly structured

export default function SuggestPage() {
  const [storedData, setStoredData] = useState(null);
  const [goalCGPA, setGoalCGPA] = useState(""); // Renamed for clarity: goalCGPA
  const [recommendations, setRecommendations] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem("gpaData");
    if (data) {
      try {
        setStoredData(JSON.parse(data));
      } catch (err) {
        console.error("Failed to parse localStorage data:", err);
      }
    }
  }, []);

  // Helper function to get the minimum marks required for a specific GPA
  // Ensure gradeList is structured like: [{ min: 90, max: 100, gpa: 4.0, grade: "A" }, ...]
  function getRequiredMarksForGPA(gpa) {
    // We sort the gradeList by GPA in ascending order to ensure we get the lowest marks for the target GPA.
    // This is robust even if gradeList isn't initially sorted.
    const sortedGradeList = [...gradeList].sort((a, b) => a.gpa - b.gpa);

    // Find the first entry where the item's GPA is greater than or equal to the target GPA.
    // This gives us the 'threshold' grade.
    const entry = sortedGradeList.find((item) => item.gpa >= gpa);

    return entry ? entry.min : 100; // If no entry covers the GPA (e.g., target > 4.0), assume 100 marks.
  }

  function calculateRecommendations() {
    if (!storedData || !goalCGPA) {
      setRecommendations([{ suggestion: "Please enter a desired CGPA and ensure data is loaded." }]);
      return;
    }

    const goal = parseFloat(goalCGPA);
    const currentCGPA = storedData.finalGPA ? parseFloat(storedData.finalGPA) : 0; // Get current CGPA (Overall CGPA)
    // --- IMPORTANT FIX HERE ---
    // Use the totalCredits passed from GpaCalculator, which is the overallCumulativeCredits
    const overallCumulativeCredits = storedData.totalCredits ? parseFloat(storedData.totalCredits) : 0;


    // --- VALIDATION ---
    if (isNaN(goal) || goal < 0) {
      setRecommendations([{ suggestion: "Please enter a valid numeric CGPA." }]);
      return;
    }

    if (goal > 4.0) {
      setRecommendations([{ suggestion: "❌ Goal CGPA cannot be higher than 4.0." }]);
      return;
    }

    if (goal <= currentCGPA) {
      setRecommendations([
        { suggestion: `✅ Your goal CGPA of ${goal.toFixed(2)} is already met or exceeded by your current CGPA of ${currentCGPA.toFixed(2)}.` },
      ]);
      return;
    }
    // --- END VALIDATION ---

    // Convert stored subjects to a usable format with current GPA and credits
    // These are only the subjects from the CURRENT semester, which are the candidates for improvement.
    const currentSemesterSubjects = storedData.subjects.map((subj, index) => {
      const { gpa } = getGradeFromMarks(Number(subj.marks));
      return {
        index,
        ...subj,
        gpa: parseFloat(gpa),
        credit: parseFloat(subj.credit),
      };
    });

    // Calculate the current total GPA points for the *entire cumulative record*
    // This is derived from the currentCGPA and overallCumulativeCredits
    const currentTotalCumulativeGPApoints = currentCGPA * overallCumulativeCredits;

    // Calculate the total GPA points needed to reach the goal CGPA
    const desiredTotalCumulativeGPApoints = goal * overallCumulativeCredits;
    let GPApointsNeeded = desiredTotalCumulativeGPApoints - currentTotalCumulativeGPApoints;

    // Filter subjects that can potentially be improved (GPA < 4.0)
    // These are from the current semester, as these are the ones the user just entered.
    // We assume improvements will be made on these.
    const candidatesForImprovement = currentSemesterSubjects
      .filter((s) => s.gpa < 4.0) // Only subjects not yet at perfect GPA
      .map((s) => ({
        ...s,
        maxGainPoints: (4.0 - s.gpa) * s.credit, // Max GPA points gain possible for this subject
      }))
      .sort((a, b) => b.maxGainPoints - a.maxGainPoints); // Prioritize subjects with higher potential gain

    const result = [];
    let possibleToReachGoal = true;

    // Iterate through candidates to suggest improvements
    for (let subj of candidatesForImprovement) {
      if (GPApointsNeeded <= 0.001) break; // Reached or exceeded goal (with a small tolerance for float precision)

      // Calculate how many GPA points we need to gain from THIS subject
      // It's either all remaining needed points, or the max this subject can provide
      const pointsToGainFromThisSubject = Math.min(GPApointsNeeded, subj.maxGainPoints);

      // If no gain possible or necessary from this subject, skip
      if (pointsToGainFromThisSubject <= 0) continue;

      // Calculate the target GPA for this specific subject
      const targetGPAForSubject = Math.min(
        subj.gpa + (pointsToGainFromThisSubject / subj.credit),
        4.0 // Cap at 4.0
      );

      // Find the minimum marks required to achieve this target GPA
      const requiredMarks = getRequiredMarksForGPA(targetGPAForSubject);

      // Calculate the actual GPA points gained from this improvement
      // This accounts for capping at 4.0 and only taking what's needed
      const actualGPAGainPoints = (targetGPAForSubject - subj.gpa) * subj.credit;

      result.push({
        ...subj,
        currentGPA: subj.gpa, // Store current GPA for display
        targetGPA: targetGPAForSubject, // Store target GPA for display
        requiredMarks: Math.ceil(requiredMarks), // Round up marks as you can't get partial marks typically
        suggestion: `Improve Subject ${subj.index + 1} (${subj.name || 'Unnamed'}): Increase GPA from ${subj.gpa.toFixed(2)} to ${targetGPAForSubject.toFixed(2)} by scoring at least ${Math.ceil(requiredMarks)} marks.`,
      });

      // Reduce the overall GPA points needed
      GPApointsNeeded -= actualGPAGainPoints;
    }

    // Determine final message based on whether the goal was truly met
    if (GPApointsNeeded > 0.001) { // If still points needed after all possible improvements
      possibleToReachGoal = false;
    }

    if (result.length === 0 && possibleToReachGoal) { // Already met or no room for improvement
      setRecommendations([
        { suggestion: "✅ You already meet or exceed the goal CGPA, or no subjects are available for meaningful improvement." },
      ]);
    } else if (result.length === 0 && !possibleToReachGoal) { // Cannot reach goal and no subjects can be improved
        setRecommendations([
            { suggestion: `❌ It's not possible to reach your desired CGPA of ${goal.toFixed(2)} with the current subjects, as no subjects can be improved further to meet the target.` },
        ]);
    }
    else if (!possibleToReachGoal) { // Some improvements, but still short of goal
        setRecommendations([
            ...result,
            { suggestion: `⚠️ Even after improving the suggested subjects, it might not be possible to reach your goal CGPA of ${goal.toFixed(2)}. You are still short by ${GPApointsNeeded.toFixed(2)} GPA points. Consider focusing on other strategies or adjusting your goal.` },
        ]);
    } else { // Goal is achievable with the suggestions
        setRecommendations(result);
    }
  }

return (
  <div
    className="min-h-screen py-8 px-4 sm:px-8"
    style={{ backgroundColor: "#F4FEFD", color: "#1B2223" }}
  >
    {/* Page Header Block */}
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-[#0EF6CC] p-6 mb-6">
      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: "#3A4F50" }}>
        🎓 CGPA Improvement Planner
      </h1>
      {storedData && (
        <div className="text-center text-lg">
          <p>
            Current Overall CGPA:{" "}
            <span className="font-bold text-[#3A4F50]">
              {parseFloat(storedData.finalGPA).toFixed(2)}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Based on {parseFloat(storedData.totalCredits).toFixed(2)} total credit hours
          </p>
        </div>
      )}
    </div>

    {/* Input Block */}
    <div className="max-w-xl mx-auto bg-white border border-[#0EF6CC] rounded-2xl p-6 shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: "#3A4F50" }}>
        🎯 Set Your Target
      </h2>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="number"
          step="0.01"
          className="border border-[#3A4F50] text-[#1B2223] bg-[#F4FEFD] rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#0EF6CC]"
          placeholder="Enter desired CGPA (e.g., 3.50)"
          value={goalCGPA}
          onChange={(e) => setGoalCGPA(e.target.value)}
        />
        <button
          onClick={calculateRecommendations}
          className="bg-[#0EF6CC] text-[#1B2223] font-semibold px-5 py-2.5 rounded hover:bg-[#3A4F50] hover:text-white transition"
        >
          Generate Advice
        </button>
      </div>
    </div>

    {/* Suggestions Block */}
    {recommendations.length > 0 && (
      <div className="max-w-2xl mx-auto bg-white border border-[#0EF6CC] rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#3A4F50]">
          📘 Personalized Suggestions
        </h2>
        <ul className="space-y-4">
          {recommendations.map((rec, idx) => (
            <li
              key={idx}
              className="bg-[#EAFDFB] border border-[#3A4F50] p-4 rounded-lg shadow-sm"
            >
              {rec.suggestion.includes("✅") || rec.suggestion.includes("❌") || rec.suggestion.includes("⚠️") ? (
                <p
                  className={`text-sm font-semibold ${
                    rec.suggestion.includes("✅")
                      ? "text-green-700"
                      : rec.suggestion.includes("❌")
                      ? "text-red-700"
                      : "text-yellow-700"
                  }`}
                >
                  {rec.suggestion}
                </p>
              ) : (
                <>
                  <p className="font-semibold">
                    Subject {rec.index + 1}: {rec.name || "Unnamed"}
                  </p>
                  <p>📌 Current Marks: {rec.marks}</p>
                  {rec.currentGPA !== undefined && <p>🎯 Current GPA: {rec.currentGPA.toFixed(2)}</p>}
                  <p>🕐 Credit Hours: {rec.credit}</p>
                  {rec.targetGPA !== undefined && <p>📈 Target GPA: {rec.targetGPA.toFixed(2)}</p>}
                  {rec.requiredMarks !== undefined && (
                    <p>
                      Required Marks to reach target:{" "}
                      <strong className="text-[#3A4F50]">{rec.requiredMarks}</strong>
                    </p>
                  )}
                  <p className="mt-1 text-[#3A4F50] italic">{rec.suggestion}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);


}