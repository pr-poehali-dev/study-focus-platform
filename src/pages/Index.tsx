import { Layout } from "@/components/layout/Layout";
import { PomodoroTimer } from "@/components/timer/PomodoroTimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Video,
  Users,
  BookOpen,
  Clock,
  MousePointerClick,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Pomodoro таймер",
    description:
      "Повысьте продуктивность с помощью проверенной техники тайм-менеджмента",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Учебные залы",
    description:
      "Присоединяйтесь к виртуальным комнатам для совместного обучения и мотивации",
  },
  {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: "Видеозвонки",
    description: "Общайтесь с одногруппниками или коллегами в реальном времени",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "Чат",
    description: "Задавайте вопросы и делитесь идеями в текстовом формате",
  },
];

export default function Index() {
  return (
    <Layout>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-accent/30 dark:bg-accent/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Учитесь эффективнее вместе с{" "}
                  <span className="text-primary">StudyFocus</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Повысьте свою продуктивность с помощью таймера Pomodoro,
                  виртуальных учебных залов, видеозвонков и чата — всё в одном
                  месте.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-1" asChild>
                  <Link to="/rooms">
                    Начать сейчас <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/about">Узнать больше</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <PomodoroTimer />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Все необходимое для продуктивной учебы
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              StudyFocus объединяет инструменты, которые помогут вам сохранять
              концентрацию и учиться более эффективно.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-fade-in"
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Как это работает
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Простой процесс для повышения вашей продуктивности в несколько
              шагов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center border-4 border-background">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold">Настройте таймер</h3>
              <p className="text-muted-foreground">
                Выберите продолжительность рабочих сессий и перерывов в
                соответствии с вашими предпочтениями.
              </p>
            </div>

            <div
              className="flex flex-col items-center text-center space-y-4 animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center border-4 border-background">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold">
                Присоединитесь к учебному залу
              </h3>
              <p className="text-muted-foreground">
                Найдите единомышленников или создайте собственный зал для
                совместного обучения.
              </p>
            </div>

            <div
              className="flex flex-col items-center text-center space-y-4 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center border-4 border-background">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold">Учитесь продуктивно</h3>
              <p className="text-muted-foreground">
                Используйте видеозвонки и чат для общения, а таймер для контроля
                времени.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Готовы повысить свою продуктивность?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                Присоединяйтесь к StudyFocus сегодня и начните учиться
                эффективнее.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-1 animate-fade-in" asChild>
                <Link to="/login">
                  <MousePointerClick className="mr-2 h-5 w-5" />{" "}
                  Зарегистрироваться
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                <BookOpen className="mr-2 h-5 w-5" /> Открыть демо-версию
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
