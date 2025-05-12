import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

// Схемы валидации
const loginSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" }),
  password: z
    .string()
    .min(6, { message: "Пароль должен содержать минимум 6 символов" }),
});

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Имя должно содержать минимум 2 символа" }),
    email: z.string().email({ message: "Введите корректный email" }),
    password: z
      .string()
      .min(6, { message: "Пароль должен содержать минимум 6 символов" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Инициализация форм
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Обработчики отправки форм
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Здесь будет логика авторизации
      console.log("Login data:", data);

      // Логика входа через хук useAuth
      await login(data.email, data.password);

      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в StudyFocus!",
      });

      // Перенаправляем пользователя на главную
      navigate("/");
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Проверьте правильность введенных данных",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Здесь будет логика регистрации
      console.log("Register data:", data);

      // Имитация задержки API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Успешная регистрация",
        description: "Добро пожаловать в StudyFocus!",
      });
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: "Не удалось создать аккаунт, попробуйте позже",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик авторизации через соцсети
  const handleSocialAuth = (provider: string) => {
    toast({
      title: "Авторизация через " + provider,
      description: "Эта функция находится в разработке",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>

        {/* Таб входа */}
        <TabsContent value="login">
          <CardHeader>
            <CardTitle>Вход в аккаунт</CardTitle>
            <CardDescription>
              Войдите, чтобы продолжить работу в StudyFocus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="text-right">
                        <a
                          href="/forgot-password"
                          className="text-sm text-primary hover:underline"
                        >
                          Забыли пароль?
                        </a>
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Выполняется вход..." : "Войти"}
                </Button>
              </form>
            </Form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-sm text-muted-foreground">
                  или войдите через
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialAuth("ВКонтакте")}
              >
                <Icon name="MessageCircle" className="mr-2 h-4 w-4" />
                ВК
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialAuth("Google")}
              >
                <Icon name="Mail" className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialAuth("Яндекс")}
              >
                <Icon name="SquareY" className="mr-2 h-4 w-4" />
                Яндекс
              </Button>
            </div>
          </CardContent>
        </TabsContent>

        {/* Таб регистрации */}
        <TabsContent value="register">
          <CardHeader>
            <CardTitle>Создать аккаунт</CardTitle>
            <CardDescription>
              Зарегистрируйтесь, чтобы начать использовать StudyFocus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <Input placeholder="Иван Иванов" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Подтверждение пароля</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Создание аккаунта..." : "Зарегистрироваться"}
                </Button>
              </form>
            </Form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-sm text-muted-foreground">
                  или зарегистрируйтесь через
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialAuth("ВКонтакте")}
              >
                <Icon name="MessageCircle" className="mr-2 h-4 w-4" />
                ВК
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialAuth("Google")}
              >
                <Icon name="Mail" className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialAuth("Яндекс")}
              >
                <Icon name="SquareY" className="mr-2 h-4 w-4" />
                Яндекс
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      <CardFooter className="flex flex-col items-center text-center text-xs text-muted-foreground">
        <p>Регистрируясь, вы соглашаетесь с</p>
        <p>
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Условиями использования
          </a>{" "}
          и{" "}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Политикой конфиденциальности
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

export default AuthForm;
