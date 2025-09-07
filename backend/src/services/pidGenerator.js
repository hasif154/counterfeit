import { v4 as uuidv4 } from 'uuid';

export function generatePIDs(quantity) {
  const pids = [];
  for (let i = 0; i < quantity; i++) {
    // Generate a shorter, more readable PID
    const uuid = uuidv4().replace(/-/g, '');
    const pid = `BA${uuid.substring(0, 12).toUpperCase()}`;
    pids.push(pid);
  }
  return pids;
}