'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbsProps } from './types';
import styles from './Breadcrumbs.module.css';

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className={styles.item}>
              {isLast ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                  <ChevronRight size={16} className={styles.separator} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

