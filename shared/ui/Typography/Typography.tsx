import React from 'react';
import { cn } from '@/utils/cn';
import styles from './Typography.module.css';

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLBold'
  | 'bodyLSB'
  | 'bodyLMed'
  | 'bodyMBold'
  | 'bodyMSB'
  | 'bodyMMed'
  | 'bodySBold'
  | 'bodySSB'
  | 'bodySMed'
  | 'bodyXSBold'
  | 'bodyXSSB'
  | 'bodyXSMed';

type TextAlign = 'left' | 'right' | 'center';

interface TypographyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: Variant;
  color?: string;
  textAlign?: TextAlign;
  required?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  h1: styles.h1,
  h2: styles.h2,
  h3: styles.h3,
  bodyLBold: styles.bodyLBold,
  bodyLSB: styles.bodyLSB,
  bodyLMed: styles.bodyLMed,
  bodyMBold: styles.bodyMBold,
  bodyMSB: styles.bodyMSB,
  bodyMMed: styles.bodyMMed,
  bodySBold: styles.bodySBold,
  bodySSB: styles.bodySSB,
  bodySMed: styles.bodySMed,
  bodyXSBold: styles.bodyXSBold,
  bodyXSSB: styles.bodyXSSB,
  bodyXSMed: styles.bodyXSMed,
};

const textAlignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyMSB',
  color,
  textAlign = 'left',
  required = false,
  children,
  className,
  ...props
}) => {
  const Component = ['h1', 'h2', 'h3'].includes(variant) ? 'h1' : 'p';

  return (
    <Component
      className={cn(
        variantClasses[variant],
        textAlignClasses[textAlign],
        className
      )}
      style={{ color }}
      {...props}
    >
      {children}
      {required && <span className={styles.required}>*</span>}
    </Component>
  );
};
