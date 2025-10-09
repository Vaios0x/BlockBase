'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnlyWrapper({ 
  children, 
  fallback = (
    <div className="flex items-center gap-2 p-4 rounded-2xl border shadow-lg bg-white/8 backdrop-blur-md border-white/12">
      <div className="animate-pulse">
        <div className="h-4 bg-white/20 rounded w-24 mb-2"></div>
        <div className="h-3 bg-white/10 rounded w-16"></div>
      </div>
    </div>
  )
}: ClientOnlyWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
