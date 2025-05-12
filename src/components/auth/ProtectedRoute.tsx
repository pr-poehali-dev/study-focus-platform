
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  redirectPath = "/login" 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Для доступа к этой странице необходимо войти в аккаунт.",
        variant: "destructive",
      });
      navigate(redirectPath);
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath, toast]);

  // Если страница загружается или пользователь не аутентифицирован, не показываем содержимое
  if (isLoading || !isAuthenticated) {
    return null;
  }

  // Если пользователь аутентифицирован, показываем содержимое
  return <>{children}</>;
};

export default ProtectedRoute;
