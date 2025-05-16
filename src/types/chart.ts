export type ChartData = {
  month: string;
  income: number;
  outcome: number;
};

export type ResponseChartData = {
  data: ChartData[];
  dateRange?: string;
  trending?: number | null;
};
