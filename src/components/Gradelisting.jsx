import { FaCalculator, FaBook } from 'react-icons/fa';
import { gradeList } from './gradelist';

const GradeListing = () => {
  return (
    <section
      className="bg-[#F4FEFD] text-[#1B2223] py-10 px-6 rounded-2xl shadow-lg border border-[#0EF6CC] max-w-5xl mx-auto mt-10"
    >
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <FaBook className="text-[#0EF6CC] text-3xl" />
        <h2 className="text-3xl font-bold text-[#3A4F50]">Grade List</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full max-w-3xl mx-auto text-sm text-left border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#3A4F50] text-white">
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Marks Range</th>
              <th className="px-4 py-3">GPA</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {gradeList.map((item, index) => (
              <tr
                key={index}
                className={`transition-all duration-150 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-[#EAFDFB]'
                } hover:bg-[#C7FFF6]`}
              >
                <td className="px-4 py-3 font-semibold text-[#3A4F50]">{item.grade}</td>
                <td className="px-4 py-3">{item.min} - {item.max}</td>
                <td className="px-4 py-3 text-[#0EF6CC] font-medium">{item.gpa.toFixed(2)}</td>
                <td className="px-4 py-3 italic text-[#1B2223]">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Footer Note */}
      <div className="flex items-center gap-3 mt-8">
        <FaCalculator className="text-[#0EF6CC] text-xl" />
        <p className="text-sm text-[#3A4F50]">
          Use this list to understand your GPA and academic performance.
        </p>
      </div>
    </section>
  );
};

export default GradeListing;