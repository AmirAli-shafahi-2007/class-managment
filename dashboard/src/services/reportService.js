import { apiFetch } from "../api/fetch";

const reportService = {
  monthlyTeaching: (year, month, companyId = "") =>
    apiFetch(
      `/api/report/monthly-teaching?year=${year}&month=${month}${companyId ? `&companyId=${companyId}` : ""}`,
    ),

  teachingByCompany: (companyId = "") =>
    apiFetch(
      `/api/report/company-teaching${companyId ? `?companyId=${companyId}` : ""}`,
    ),

  monthlyIncome: (year, month, companyId = "") =>
    apiFetch(
      `/api/report/monthly-income?year=${year}&month=${month}${companyId ? `&companyId=${companyId}` : ""}`,
    ),

  incomeByDateRange: (start, end, companyId = "") =>
    apiFetch(
      `/api/report/income-range?start=${start}&end=${end}${companyId ? `&companyId=${companyId}` : ""}`,
    ),

  companiesByDateRange: (start, end, companyId = "") =>
    apiFetch(
      `/api/report/companies-range?start=${start}&end=${end}${companyId ? `&companyId=${companyId}` : ""}`,
    ),

  contractsReport: () => apiFetch(`/api/report/contracts`),

  classesReport: (startDate, endDate, companyId = "") => {
    let url = `/api/report/classes?`;
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;
    if (companyId) url += `companyId=${companyId}`;
    return apiFetch(url);
  },
  monthlyTeachingRange: (startDate, endDate, companyId = "") =>
    apiFetch(
      `/api/report/monthly-teaching-range?startDate=${startDate}&endDate=${endDate}${companyId ? `&companyId=${companyId}` : ""}`,
    ),

  // سرویس جدید برای گزارش شرکت‌ها با بازه زمانی
  teachingByCompanyRange: (startDate, endDate, companyId = "") =>
    apiFetch(
      `/api/report/company-teaching-range?startDate=${startDate}&endDate=${endDate}${companyId ? `&companyId=${companyId}` : ""}`,
    ),
};

export default reportService;
