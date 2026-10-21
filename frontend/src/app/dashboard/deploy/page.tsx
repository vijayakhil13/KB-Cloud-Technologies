import type { Metadata } from 'next';
import DeployWizard from '@/components/deploy/DeployWizard';
import PageHeader from '@/components/dashboard/PageHeader';

export const metadata: Metadata = { title: 'Deploy a server' };

export default function DeployPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Deploy a server" subtitle="Four short steps. You see the price as you choose." />
      <DeployWizard />
    </div>
  );
}
