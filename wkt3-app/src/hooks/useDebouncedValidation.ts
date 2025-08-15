// "use client"
import { useState, useEffect } from "react";
export default function useDebouncedValidation<T>(
  value: T,
  delay = 500,
  validator?: (v: T) => Promise<any>
) {
  const [valid, setValid] = useState<{
    loading: boolean;
    ok?: boolean;
    message?: string;
  }>({ loading: false });
  useEffect(() => {
    let mounted = true;
    const id = setTimeout(async () => {
      setValid({ loading: true });
      if (validator) {
        try {
          const r = await validator(value);
          if (!mounted) return;
          setValid({ loading: false, ok: true });
        } catch (e: any) {
          if (!mounted) return;
          setValid({ loading: false, ok: false, message: e.message });
        }
      } else {
        setValid({ loading: false, ok: true });
      }
    }, delay);
    return () => {
      mounted = false;
      clearTimeout(id);
    };
  }, [value]);
  return valid;
}
