export const calculatePartialCharge = (
  hoursCharged: number,
  fullChargeDuration: number,
  maxRange: number,
  currentRange: number
): number => {
  const rangeAdded = (hoursCharged / fullChargeDuration) * maxRange;
  const newRange = Math.min(currentRange + rangeAdded, maxRange);
  return Math.round(newRange * 10) / 10;
};

export const getRangeStatus = (
  range: number,
  lowThreshold: number,
  criticalThreshold: number
): 'good' | 'warning' | 'critical' => {
  if (range < criticalThreshold) return 'critical';
  if (range < lowThreshold) return 'warning';
  return 'good';
};

export const getRangeColor = (status: 'good' | 'warning' | 'critical'): string => {
  switch (status) {
    case 'good': return '#10b981';
    case 'warning': return '#f59e0b';
    case 'critical': return '#ef4444';
  }
};

export const canMakeTrip = (currentRange: number, distance: number): boolean => {
  return currentRange >= distance;
};

export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  const csv = [headers, ...rows].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
