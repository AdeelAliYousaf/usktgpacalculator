export const gradeList = [
  { min: 85, max: 100, grade: 'A+', gpa: 4.00, status: 'Exceptional' },
  { min: 80, max: 84, grade: 'A', gpa: 3.66, status: 'Outstanding' },
  { min: 75, max: 79, grade: 'B+', gpa: 3.33, status: 'Excellent' },
  { min: 71, max: 74, grade: 'B', gpa: 3.00, status: 'Very Good' },
  { min: 68, max: 70, grade: 'B-', gpa: 2.66, status: 'Good' },
  { min: 64, max: 67, grade: 'C+', gpa: 2.33, status: 'Above Average' },
  { min: 61, max: 63, grade: 'C', gpa: 2.00, status: 'Average' },
  { min: 58, max: 60, grade: 'C-', gpa: 1.66, status: 'Satisfactory' },
  { min: 54, max: 57, grade: 'D+', gpa: 1.33, status: 'Marginal Pass' },
  { min: 50, max: 53, grade: 'D', gpa: 1.00, status: 'Unsatisfactory' },
  { min: 0,  max: 49, grade: 'F', gpa: 0.00, status: 'Fail' },
];

export function getGradeFromMarks(marks) {
  for (const { min, max, grade, gpa, status } of gradeList) {
    if (marks >= min && marks <= max) {
      return { grade, gpa, status };
    }
  }
  return { grade: 'Invalid', gpa: 0.0, status: 'Unknown' };
}
