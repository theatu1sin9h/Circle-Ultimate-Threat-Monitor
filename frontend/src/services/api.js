const API_BASE_URL = 'http://localhost:5000/api';

export const fetchNetworkState = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/network/state`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching network state:', error);
    return null;
  }
};

export const triggerInjectSuspicious = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/demo/inject-suspicious`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const triggerAttack = async (deviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/demo/trigger-attack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId }),
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const executeDeviceAction = async (deviceId, action) => {
  try {
    const response = await fetch(`${API_BASE_URL}/device/${deviceId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const triggerReset = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/demo/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const addSystemLog = async (message, level) => {
  try {
    await fetch(`${API_BASE_URL}/demo/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, level })
    });
  } catch (e) {
    console.error(e);
  }
};

export const updateSystemConfig = async (key, value) => {
  try {
    await fetch(`${API_BASE_URL}/demo/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
  } catch (e) {
    console.error(e);
  }
};
