// EMISSION_FACTORS now handled by getFactors()

export const calculateEmissions = (userData) => {
  const factors = getFactors();
  const s1Diesel = (userData.diesel || 0) * factors.diesel;
  const s1Petrol = (userData.petrol || 0) * factors.petrol;
  const scope1 = s1Diesel + s1Petrol;

  const scope2 = (userData.electricity || 0) * factors.electricity;
  const scope3 =
    (userData.flights || 0) * factors.flights +
    (userData.waste || 0) * factors.waste;

  const totalMonthly = scope1 + scope2 + scope3;
  const annual = (totalMonthly * 12) / 1000;
  const perEmployee = (totalMonthly * 12) / (userData.employees || 1);
  const offsetCost = annual * 15;

  const tonsMonthly = totalMonthly / 1000;
  let riskLevel = "Low";
  if (tonsMonthly > 15) {
    riskLevel = "High";
  } else if (tonsMonthly >= 5) {
    riskLevel = "Medium";
  }

  return {
    scope1: scope1 / 1000, // convert to tons
    scope2: scope2 / 1000,
    scope3: scope3 / 1000,
    total: tonsMonthly,
    annual,
    perEmployee,
    offsetCost,
    riskLevel,
  };
};

export const saveRecord = (userEmail, userData, results) => {
  if (!userEmail) return null;
  const record = {
    userEmail,
    date: new Date().toISOString().split("T")[0],
    id: Math.random().toString(36).substring(2, 9),
    entity: userData.companyName || "Unknown Org",
    s1: results.scope1,
    s2: results.scope2,
    s3: results.scope3,
    total: results.total,
    risk: results.riskLevel,
    fullData: userData,
  };

  let history = JSON.parse(localStorage.getItem(`carbon_history_${userEmail}`) || "[]");
  history.unshift(record);
  localStorage.setItem(`carbon_history_${userEmail}`, JSON.stringify(history));
  return record;
};

export const getHistory = (userEmail) => {
    if (!userEmail) return [];
    return JSON.parse(localStorage.getItem(`carbon_history_${userEmail}`) || "[]");
};

export const deleteHistory = (userEmail, id) => {
    if (!userEmail) return [];
    let history = getHistory(userEmail);
    history = history.filter(h => h.id !== id);
    localStorage.setItem(`carbon_history_${userEmail}`, JSON.stringify(history));
    return history;
};

const DEFAULT_FACTORS = {
  electricity: 0.82,
  diesel: 2.68,
  petrol: 2.31,
  flights: 0.15,
  waste: 0.5,
};

export const getFactors = (userEmail) => {
    if (!userEmail) return DEFAULT_FACTORS;
    const custom = JSON.parse(localStorage.getItem(`carbon_factors_${userEmail}`) || "{}");
    return { ...DEFAULT_FACTORS, ...custom };
};

export const saveFactors = (userEmail, factors) => {
    if (!userEmail) return;
    localStorage.setItem(`carbon_factors_${userEmail}`, JSON.stringify(factors));
};

export const getSettings = (userEmail) => {
    if (!userEmail) return {};
    return JSON.parse(localStorage.getItem(`carbon_settings_${userEmail}`) || "{}");
};

export const saveSettings = (userEmail, settings) => {
    if (!userEmail) return;
    localStorage.setItem(`carbon_settings_${userEmail}`, JSON.stringify(settings));
};
