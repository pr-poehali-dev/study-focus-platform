
import { useState, useEffect, useRef } from "react";
import { Settings, Play, Pause, RotateCcw } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type TimerMode = "focus" | "shortBreak" | "longBreak";

interface TimerSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
}

export function PomodoroTimer() {
  // Настройки таймера
  const [settings, setSettings] = useState<TimerSettings>({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: true,
    longBreakInterval: 4
  });

  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const timer = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Эффект для инициализации аудио
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Эффект для инициализации времени при изменении режима
  useEffect(() => {
    resetTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, settings]);

  // Эффект для запуска и остановки таймера
  useEffect(() => {
    if (isActive) {
      timer.current = window.setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleTimerComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timer.current) {
      clearInterval(timer.current);
    }

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // Обработка завершения таймера
  const handleTimerComplete = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play error:", e));
    }
    
    if (mode === "focus") {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);
      
      if (newCompletedPomodoros % settings.longBreakInterval === 0) {
        setMode("longBreak");
        if (settings.autoStartBreaks) setIsActive(true);
      } else {
        setMode("shortBreak");
        if (settings.autoStartBreaks) setIsActive(true);
      }
    } else {
      setMode("focus");
      if (settings.autoStartPomodoros) setIsActive(true);
    }
    
    clearInterval(timer.current!);
    setIsActive(false);
  };

  // Сброс таймера
  const resetTimer = () => {
    setIsActive(false);
    if (timer.current) clearInterval(timer.current);
    
    if (mode === "focus") {
      setTimeLeft(settings.focus * 60);
    } else if (mode === "shortBreak") {
      setTimeLeft(settings.shortBreak * 60);
    } else {
      setTimeLeft(settings.longBreak * 60);
    }
  };

  // Форматирование оставшегося времени
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Вычисление процента времени для прогресс-бара
  const calculateProgress = () => {
    let totalTime;
    
    if (mode === "focus") {
      totalTime = settings.focus * 60;
    } else if (mode === "shortBreak") {
      totalTime = settings.shortBreak * 60;
    } else {
      totalTime = settings.longBreak * 60;
    }
    
    return 100 - (timeLeft / totalTime * 100);
  };

  // Сохранение новых настроек
  const saveSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
    resetTimer();
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex justify-between items-center">
          <span className="flex-1">Pomodoro Таймер</span>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Настройки таймера</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Длительность (в минутах)</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span>Фокус: {settings.focus} мин</span>
                      <Slider 
                        value={[settings.focus]} 
                        min={5} 
                        max={60}
                        step={1}
                        className="w-[200px]"
                        onValueChange={(value) => setSettings({...settings, focus: value[0]})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Короткий перерыв: {settings.shortBreak} мин</span>
                      <Slider 
                        value={[settings.shortBreak]} 
                        min={1} 
                        max={15}
                        step={1}
                        className="w-[200px]"
                        onValueChange={(value) => setSettings({...settings, shortBreak: value[0]})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Длинный перерыв: {settings.longBreak} мин</span>
                      <Slider 
                        value={[settings.longBreak]} 
                        min={5} 
                        max={30}
                        step={1}
                        className="w-[200px]"
                        onValueChange={(value) => setSettings({...settings, longBreak: value[0]})} 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsSettingsOpen(false)}>Сохранить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        
        <Tabs value={mode} onValueChange={(value) => setMode(value as TimerMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="focus">Фокус</TabsTrigger>
            <TabsTrigger value="shortBreak">Короткий перерыв</TabsTrigger>
            <TabsTrigger value="longBreak">Длинный перерыв</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-full">
          <Progress value={calculateProgress()} className="h-2 w-full" />
        </div>
        
        <div className="text-6xl font-bold font-montserrat tracking-tighter">
          {formatTime()}
        </div>
        
        <div className="flex space-x-4">
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? 
              <><Pause className="h-4 w-4" /> Пауза</> : 
              <><Play className="h-4 w-4" /> Старт</>
            }
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={resetTimer}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" /> Сброс
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {mode === "focus" ? "Время сосредоточиться!" : "Время для перерыва!"}
        </div>
        <Badge variant="secondary" className="bg-secondary">
          Завершено: {completedPomodoros}
        </Badge>
      </CardFooter>
    </Card>
  );
}

export default PomodoroTimer;
