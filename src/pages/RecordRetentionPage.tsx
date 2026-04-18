import React from 'react';
import { UniversalModule } from '../components/universal/UniversalModule';
import { MODULE_CONFIGS } from '../config/moduleConfigs';

interface Props { onNavigate: (page: string, params?: any) => void; }

export function RecordRetentionPage({ onNavigate }: Props) {
  return <UniversalModule config={MODULE_CONFIGS.recordRetention} onNavigate={onNavigate} />;
}
