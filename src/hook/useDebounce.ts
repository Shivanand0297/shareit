import { useEffect, useState } from "react";

const useDebounce = <T>(searchTerm: T, delay: number): T => {
  const [debouncedSearch, setDebouncedSearch] = useState<T>(searchTerm);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, delay);

    return () => {
      clearTimeout(timeOutId)
    }
  }, [searchTerm, delay]);

  return debouncedSearch;
};

export default useDebounce;