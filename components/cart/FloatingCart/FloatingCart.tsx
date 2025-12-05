'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { usePathname } from 'next/navigation';
import styles from './FloatingCart.module.css';

export const FloatingCart: React.FC = () => {
  const { totalItems } = useCartStore();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [prevTotalItems, setPrevTotalItems] = useState(0);
  const [badgeBounce, setBadgeBounce] = useState(false);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const cartHref = useMemo(() => {
    const lang = pathname.split('/')[1] || 'en';
    return `/${lang}/cart`;
  }, [pathname]);

  useEffect(() => {
    if (totalItems > 0) {
      const rafId = requestAnimationFrame(() => {
        setShouldRender(true);
        const timer = setTimeout(() => {
          setIsVisible(true);
          if (anchorRef.current) {
            setTimeout(() => {
              if (anchorRef.current) {
                anchorRef.current.style.willChange = 'auto';
              }
            }, 400);
          }
        }, 10);
        return () => clearTimeout(timer);
      });
      return () => cancelAnimationFrame(rafId);
    } else {
      const rafId = requestAnimationFrame(() => {
        setIsVisible(false);
        if (anchorRef.current) {
          anchorRef.current.style.willChange = 'transform, opacity';
        }
        const timer = setTimeout(() => {
          setShouldRender(false);
          if (anchorRef.current) {
            anchorRef.current.style.willChange = 'auto';
          }
        }, 400);
        return () => clearTimeout(timer);
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [totalItems]);

  useEffect(() => {
    if (totalItems > prevTotalItems && prevTotalItems > 0) {
      const rafId = requestAnimationFrame(() => {
        setBadgeBounce(true);
        const timer = setTimeout(() => setBadgeBounce(false), 600);
        return () => clearTimeout(timer);
      });
      return () => cancelAnimationFrame(rafId);
    }
    const rafId = requestAnimationFrame(() => {
      setPrevTotalItems(totalItems);
    });
    return () => cancelAnimationFrame(rafId);
  }, [totalItems, prevTotalItems]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Link 
      ref={anchorRef}
      href={cartHref} 
      className={`${styles.anchor} ${isVisible ? styles.visible : ''}`}
      aria-label="Shopping cart"
    >
      <div className={styles.iconContainer}>
        <ShoppingCart size={24} className={styles.icon} />
        {totalItems > 0 && (
          <span className={`${styles.badge} ${badgeBounce ? styles.badgeBounce : ''}`}>
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>
    </Link>
  );
};

