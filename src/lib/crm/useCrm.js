import { useEffect, useState, useCallback } from 'react';

/**
 * Subscribe a component to the CRM store. `selector` is a function that reads
 * the current value from the store; it re-runs whenever the store changes.
 */
export function useCrm(selector) {
  const read = useCallback(selector, []);
  const [value, setValue] = useState(read);

  useEffect(() => {
    const refresh = () => setValue(read());
    refresh();
    window.addEventListener('freshlien-crm-change', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('freshlien-crm-change', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [read]);

  return value;
}
