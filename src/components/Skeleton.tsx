import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = 'w-48', height = 'h-2.5', className = '' }) => {
  return (
    <div role="status" className={`animate-pulse ${className}`}>
      <div className={`rounded-full bg-gray-200 dark:bg-gray-700 ${width} ${height} mb-4`}></div>
      <div className={`rounded-full bg-gray-200 dark:bg-gray-700 ${width} mb-2.5 h-2 max-w-[360px]`}></div>
      <div className={`rounded-full bg-gray-200 dark:bg-gray-700 ${width} mb-2.5 h-2 max-w-[330px]`}></div>
      <div className={`rounded-full bg-gray-200 dark:bg-gray-700 ${width} mb-2.5 h-2 max-w-[300px]`}></div>
      <div className={`rounded-full bg-gray-200 dark:bg-gray-700 ${width} h-2 max-w-[360px]`}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Skeleton;
