'use client';

import React from 'react';
import { Typography } from '../Typography/Typography';
import styles from './Tabs.module.css';

interface TabsProps {
  tabs: number[] | undefined;
  activeTab: number | undefined;
  onTabChange: (id: number) => void;
  isLoading: boolean;
  unit: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  isLoading,
  unit,
}) => {
  if (isLoading || !tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`${styles.tab} ${
            activeTab === tab ? styles.active : ''
          }`}
        >
          <Typography variant="bodyMSB">
            {tab} {unit}
          </Typography>
        </button>
      ))}
    </div>
  );
};

