
import { Layout } from "@/components/layout/Layout";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">
            Добро пожаловать в StudyFocus
          </h1>
          <AuthForm />
        </div>
      </div>
    </Layout>
  );
}
