const API = process.env.API_URL || 'http://localhost:8000/api';

async function req(path) {
  const r = await fetch(`${API}${path}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('API error');
  return r.json();
}

export const getHealth = async () => fetch('http://localhost:8000/health').then(r => r.json());
export const getDashboard = async () => req('/dashboard');
export const getOee = async () => req('/oee');
export const getLines = async () => req('/lines');
export const getOrders = async () => req('/production-orders');
export const getDowntimes = async () => req('/downtimes');
export const getLabApprovals = async () => req('/lab-approvals/latest');
export const getInventoryMoves = async () => req('/inventory/moves');
export const getMaintenance = async () => req('/maintenance/tickets');
export const getUtilities = async () => req('/utilities/summary');
