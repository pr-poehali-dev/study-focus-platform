import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Определяем тип пользователя
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Состояние аутентификации
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  socialAuth: (provider: string) => Promise<void>;
}

// Создаем контекст
const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем, авторизован ли пользователь при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем наличие токена в localStorage
        const token = localStorage.getItem("auth-token");

        if (token) {
          // В реальном приложении здесь был бы запрос к серверу для проверки токена
          // и получения данных пользователя
          // Для примера используем моковые данные
          const savedUser = localStorage.getItem("auth-user");
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (error) {
        console.error("Ошибка проверки аутентификации:", error);
        // В случае ошибки, очищаем состояние
        setUser(null);
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Функция входа
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // В реальном приложении здесь был бы запрос к API для авторизации
      // Для примера используем имитацию
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Упрощаем тестовые данные для демо - любые корректные данные позволят войти
      if (email && password.length >= 6) {
        const userData: User = {
          id: "1",
          name: email.split("@")[0],
          email: email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        };

        // Сохраняем токен и данные пользователя в localStorage
        localStorage.setItem("auth-token", "mock-jwt-token");
        localStorage.setItem("auth-user", JSON.stringify(userData));

        setUser(userData);
        return;
      }

      throw new Error("Неверное имя пользователя или пароль");
    } catch (error) {
      console.error("Ошибка входа:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция регистрации
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // В реальном приложении здесь был бы запрос к API для регистрации
      // Для примера используем имитацию
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData: User = {
        id: Date.now().toString(),
        name,
        email,
      };

      // Сохраняем токен и данные пользователя в localStorage
      localStorage.setItem("auth-token", "mock-jwt-token");
      localStorage.setItem("auth-user", JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция выхода
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
  };

  // Функция для авторизации через соцсети
  const socialAuth = async (provider: string) => {
    setIsLoading(true);
    try {
      // В реальном приложении здесь был бы код для OAuth аутентификации
      // Для примера используем имитацию
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData: User = {
        id: Date.now().toString(),
        name: `Пользователь ${provider}`,
        email: `user_${Date.now()}@${provider.toLowerCase()}.com`,
        avatar: `https://ui-avatars.com/api/?name=${provider}&background=random`,
      };

      // Сохраняем токен и данные пользователя в localStorage
      localStorage.setItem("auth-token", "mock-jwt-token");
      localStorage.setItem("auth-user", JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      console.error(`Ошибка входа через ${provider}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    socialAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
