import AuthGuard from '@/components/auth/AuthGuard';
import BuildEditor from '@/components/builds/BuildEditor';

export const metadata = {
  title: 'Create Build — D4 Builds',
};

export default async function NewBuildPage() {
  return (
    <AuthGuard>
      <BuildEditor mode="create" />
    </AuthGuard>
  );
}
