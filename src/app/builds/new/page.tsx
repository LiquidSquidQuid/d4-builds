import AuthGuard from '@/components/auth/AuthGuard';
import BuildEditor from '@/components/builds/BuildEditor';

export const metadata = {
  title: 'Create Build',
};

export default async function NewBuildPage() {
  return (
    <AuthGuard>
      <BuildEditor mode="create" />
    </AuthGuard>
  );
}
