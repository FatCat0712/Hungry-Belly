import { useEffect, useRef, useState } from "react";

export function useSyncedFormState(source, buildState) {
  const [data, setData] = useState(() => buildState(source));
  const [isDirty, setIsDirty] = useState(false);
  const previousIdentityRef = useRef(source?.id ?? null);

  // Sync form state with source data when source changes
  useEffect(() => {
    const nextIdentity = source?.id;
    const previousIdentity = previousIdentityRef.current;
    const identityChanged = nextIdentity !== previousIdentity;

    if (identityChanged || !isDirty) {
      setData(buildState(source));
      setIsDirty(false);
      previousIdentityRef.current = nextIdentity;
    }
  }, [source, buildState, isDirty]);

  const resetForm = () => {
    setData(buildState(source));
    setIsDirty(false);
    previousIdentityRef.current = source?.id ?? null;
  };

  return {
    data,
    setData,
    isDirty,
    setIsDirty,
    resetForm,
  };
}
