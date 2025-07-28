import { useState } from "react";
import { getGradeFromMarks } from "./gradelist";
import { useNavigate } from 'react-router-dom';

export default function GpaCalculator() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([{ marks: "", credit: "" }]);
  const [prevCGPA, setPrevCGPA] = useState("");
  const [prevTotalCredits, setPrevTotalCredits] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const addSubject = () => setSubjects([...subjects, { marks: "", credit: "" }]);
  const removeSubject = (index) => setSubjects(subjects.filter((_, i) => i !== index));

  const results = subjects.map(({ marks, credit }) => {
    const m = parseFloat(marks);
    const c = parseFloat(credit);
    const { gpa, grade } = getGradeFromMarks(m || 0);
    return { gpa, grade, credit: c || 0, marks: m || 0 };
  });

  const currentSemesterCredits = results.reduce((sum, s) => sum + s.credit, 0);
  const currentSemesterPoints = results.reduce((sum, s) => sum + s.gpa * s.credit, 0);
  const currentSemesterGPA = currentSemesterCredits ? (currentSemesterPoints / currentSemesterCredits).toFixed(2) : "0.00";

  const parsedPrevCGPA = parseFloat(prevCGPA) || 0;
  const parsedPrevTotalCredits = parseFloat(prevTotalCredits) || 0;

  const overallTotalCredits = parsedPrevTotalCredits + currentSemesterCredits;
  const overallTotalPoints = (parsedPrevCGPA * parsedPrevTotalCredits) + currentSemesterPoints;
  const overallCGPA = overallTotalCredits ? (overallTotalPoints / overallTotalCredits).toFixed(2) : "0.00";

  const handleSuggest = () => {
    const data = {
      subjects: results,
      currentSemesterGPA,
      totalCredits: overallTotalCredits,
      finalGPA: overallCGPA,
    };
    localStorage.setItem("gpaData", JSON.stringify(data));
    navigate("/suggest");
  };

  return (
    <div className="min-h-screen p-6 bg-[#F4FEFD] text-[#1B2223]">
      <div className="max-w-3xl mx-auto bg-white shadow-lg border border-[#0EF6CC] rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-[#0EF6CC] mb-6">
          GPA Calculator
        </h1>

        {/* Previous Record */}
        <div className="mb-6 p-4 border border-[#0EF6CC] rounded-xl bg-[#EAFDFB]">
          <h2 className="text-xl font-semibold mb-3 text-[#3A4F50]">
            Previous Academic Record
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="number"
              step="0.01"
              placeholder="Current CGPA (e.g., 3.25)"
              value={prevCGPA}
              onChange={(e) => setPrevCGPA(e.target.value)}
              className="bg-white border border-[#0EF6CC] text-[#1B2223] px-3 py-2 rounded w-full md:w-1/2"
              min="0"
              max="4.0"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Previous Total Credits"
              value={prevTotalCredits}
              onChange={(e) => setPrevTotalCredits(e.target.value)}
              className="bg-white border border-[#0EF6CC] text-[#1B2223] px-3 py-2 rounded w-full md:w-1/2"
              min="0"
            />
          </div>
        </div>

        {/* Current Semester Inputs */}
        <h2 className="text-xl font-semibold mb-3 text-[#3A4F50]">
          Current Semester Subjects
        </h2>
        {subjects.map((subj, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <input
              type="number"
              placeholder="Marks"
              value={subj.marks}
              onChange={(e) => handleChange(index, "marks", e.target.value)}
              className="bg-white border border-gray-300 text-[#1B2223] px-3 py-2 rounded w-full md:w-1/3"
              min="0"
              max="100"
            />
            <input
              type="number"
              placeholder="Credit Hours"
              value={subj.credit}
              onChange={(e) => handleChange(index, "credit", e.target.value)}
              className="bg-white border border-gray-300 text-[#1B2223] px-3 py-2 rounded w-full md:w-1/3"
              min="1"
            />
            <button
              onClick={() => removeSubject(index)}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="mt-4 flex justify-center sm:justify-end">
          <button
            onClick={addSubject}
            className="bg-[#0EF6CC] text-[#1B2223] font-semibold px-4 py-2 rounded hover:bg-teal-400 transition"
          >
            + Add Subject
          </button>
        </div>

        {/* Results */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-[#3A4F50]">
            Results for Current Semester
          </h2>
          <table className="w-full border border-[#0EF6CC] text-center rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#0EF6CC] text-[#1B2223] uppercase text-sm">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Marks</th>
                <th className="p-2 border">Credit Hours</th>
                <th className="p-2 border">Grade</th>
                <th className="p-2 border">GPA</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, idx) => (
                <tr key={idx} className="hover:bg-[#C7FFF6] transition">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{subjects[idx].marks}</td>
                  <td className="p-2 border">{res.credit}</td>
                  <td className="p-2 border">{res.grade}</td>
                  <td className="p-2 border">{res.gpa.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between text-lg font-bold text-[#3A4F50]">
            <div>SGPA: {currentSemesterGPA}</div>
            <div>Credits This Semester: {currentSemesterCredits}</div>
          </div>

          <div className="mt-4 text-2xl font-bold text-center text-[#1B2223] border-t border-[#0EF6CC] pt-4">
            🎓 Overall Cumulative GPA: <span className="text-[#0EF6CC]">{overallCGPA}</span>
          </div>

          <div className="mt-6 flex justify-center sm:justify-end">
            <button
              onClick={handleSuggest}
              className="bg-[#0EF6CC] text-[#1B2223] px-6 py-2 rounded-md font-semibold hover:bg-teal-300 transition"
            >
              Suggest Subjects to Repeat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}