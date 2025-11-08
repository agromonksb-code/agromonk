'use client';

import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export function ResponsiveGrid({ 
  children, 
  className, 
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 'lg'
}: ResponsiveGridProps) {
  const gridCols = {
    default: cols.default || 1,
    sm: cols.sm || cols.default || 1,
    md: cols.md || cols.sm || cols.default || 1,
    lg: cols.lg || cols.md || cols.sm || cols.default || 1,
    xl: cols.xl || cols.lg || cols.md || cols.sm || cols.default || 1,
    '2xl': cols['2xl'] || cols.xl || cols.lg || cols.md || cols.sm || cols.default || 1,
  };

  // Use explicit grid classes instead of dynamic ones
  const getGridClass = (cols: number) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      case 6: return 'grid-cols-6';
      default: return 'grid-cols-1';
    }
  };

  const gridClasses = [
    getGridClass(gridCols.default),
    `sm:${getGridClass(gridCols.sm)}`,
    `md:${getGridClass(gridCols.md)}`,
    `lg:${getGridClass(gridCols.lg)}`,
    `xl:${getGridClass(gridCols.xl)}`,
    `2xl:${getGridClass(gridCols['2xl'])}`,
    gapClasses[gap],
  ].join(' ');

  return (
    <div className={cn('grid', gridClasses, className)}>
      {children}
    </div>
  );
}

// Product Grid Component
interface ProductGridProps {
  children: React.ReactNode;
  className?: string;
}

export function ProductGrid({ children, className }: ProductGridProps) {
  return (
    <ResponsiveGrid
      cols={{ default: 1, sm: 2, lg: 3, xl: 4 }}
      gap="lg"
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
}

// Category Grid Component
interface CategoryGridProps {
  children: React.ReactNode;
  className?: string;
}

export function CategoryGrid({ children, className }: CategoryGridProps) {
  return (
    <ResponsiveGrid
      cols={{ default: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
      gap="lg"
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
}

// Masonry Grid Component
interface MasonryGridProps {
  children: React.ReactNode;
  className?: string;
}

export function MasonryGrid({ children, className }: MasonryGridProps) {
  return (
    <div className={cn('columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6', className)}>
      {children}
    </div>
  );
}

// Flex Grid Component
interface FlexGridProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  wrap?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export function FlexGrid({ 
  children, 
  className, 
  direction = 'row',
  wrap = true,
  justify = 'start',
  align = 'start',
  gap = 'lg'
}: FlexGridProps) {
  const flexClasses = [
    'flex',
    direction === 'col' ? 'flex-col' : 'flex-row',
    wrap ? 'flex-wrap' : 'flex-nowrap',
    `justify-${justify}`,
    `items-${align}`,
    gapClasses[gap],
  ].join(' ');

  return (
    <div className={cn(flexClasses, className)}>
      {children}
    </div>
  );
}
