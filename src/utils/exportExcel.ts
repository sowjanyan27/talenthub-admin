import * as XLSX from 'xlsx';

export const exportCandidatesExcel = (applications: any[]) => {
  const rows = applications.map(app => ({
    Name: app.candidate.full_name,
    Email: app.candidate.email,
    Experience: app.candidate.years_of_experience,
    MatchScore: app.match_score,
    Status: app.status,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
  XLSX.writeFile(wb, 'candidate_matching.xlsx');
};
