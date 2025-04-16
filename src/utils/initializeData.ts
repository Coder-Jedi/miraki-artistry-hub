
import { ensureDataConsistency } from './dataConsistency';

export const initializeAppData = () => {
  // Ensure data consistency between artworks and artists
  const result = ensureDataConsistency();
  
  if (!result.error) {
    console.log('Data initialization complete:', result);
  } else {
    console.error('Failed to initialize data');
  }
};
