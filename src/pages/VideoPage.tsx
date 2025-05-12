
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Phone, Video, VideoOff, Mic, MicOff, ScreenShare, User, Users, UserPlus, Clipboard, CheckCheck } from "lucide-react";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const activeUsers = [
  { id: "1", name: "Александр", avatar: "https://i.pravatar.cc/150?img=51", status: "available" },
  { id: "2", name: "Мария", avatar: "https://i.pravatar.cc/150?img=43", status: "in-call" },
  { id: "3", name: "Дмитрий", avatar: "https://i.pravatar.cc/150?img=53", status: "available" },
  { id: "4", name: "Екатерина", avatar: "https://i.pravatar.cc/150?img=45", status: "busy" },
  { id: "5", name: "Иван", avatar: "https://i.pravatar.cc/150?img=39", status: "available" },
];

export default function VideoPage() {
  const [activeTab, setActiveTab] = useState("create");
  const [meetingId, setMeetingId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [inCallControls, setInCallControls] = useState({
    video: true,
    audio: true,
    screen: false
  });
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Генерируем ID встречи при первой загрузке
  useEffect(() => {
    const generateMeetingId = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 9; i++) {
        if (i === 3 || i === 6) {
          result += "-";
        }
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    setMeetingId(generateMeetingId());
  }, []);

  // Редирект неавторизованных пользователей
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Для доступа к видеозвонкам необходимо войти в аккаунт.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  // Копирование ID встречи в буфер обмена
  const handleCopyMeetingId = () => {
    navigator.clipboard.writeText(meetingId).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      toast({
        title: "Скопировано",
        description: "ID встречи скопирован в буфер обмена",
      });
    });
  };

  // Имитация начала звонка
  const startCall = () => {
    toast({
      title: "Звонок начат",
      description: "Ожидание подключения других участников...",
    });
  };

  // Имитация присоединения к звонку
  const joinCall = (id: string) => {
    if (!id.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите корректный ID встречи",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Подключение к звонку",
      description: `Подключение к встрече ${id}...`,
    });
  };

  // Переключение элементов управления звонком
  const toggleControl = (control: 'video' | 'audio' | 'screen') => {
    setInCallControls({
      ...inCallControls,
      [control]: !inCallControls[control]
    });
  };

  // Имитация звонка пользователю
  const callUser = (userId: string, userName: string) => {
    toast({
      title: "Звонок пользователю",
      description: `Вызов ${userName}...`,
    });
  };

  if (!isAuthenticated) {
    return null; // Не рендерим страницу для неавторизованных пользователей
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Видеозвонки</h1>
        <p className="text-muted-foreground mb-8">
          Создавайте или присоединяйтесь к видеозвонкам для общения и совместных занятий
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="create" className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  <span>Создать встречу</span>
                </TabsTrigger>
                <TabsTrigger value="join" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Присоединиться</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Новая видеовстреча</CardTitle>
                    <CardDescription>
                      Создайте видеовстречу и пригласите других пользователей
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-muted/30 rounded-lg">
                      <div className="p-4 bg-primary/10 rounded-full">
                        <Video className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Ваша встреча готова</h3>
                      <p className="text-center text-muted-foreground">
                        Поделитесь этим ID с теми, кого хотите пригласить на встречу
                      </p>
                      
                      <div className="flex w-full max-w-md">
                        <Input
                          readOnly
                          value={meetingId}
                          className="text-center font-mono bg-muted/40"
                        />
                        <Button 
                          variant="outline" 
                          className="ml-2 gap-1"
                          onClick={handleCopyMeetingId}
                        >
                          {isCopied ? (
                            <CheckCheck className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clipboard className="h-4 w-4" />
                          )}
                          {isCopied ? "Скопировано" : "Копировать"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Настройки звонка</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <Button
                            variant={inCallControls.video ? "default" : "outline"}
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            onClick={() => toggleControl('video')}
                          >
                            {inCallControls.video ? (
                              <Video className="h-5 w-5" />
                            ) : (
                              <VideoOff className="h-5 w-5" />
                            )}
                          </Button>
                          
                          <Button
                            variant={inCallControls.audio ? "default" : "outline"}
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            onClick={() => toggleControl('audio')}
                          >
                            {inCallControls.audio ? (
                              <Mic className="h-5 w-5" />
                            ) : (
                              <MicOff className="h-5 w-5" />
                            )}
                          </Button>
                          
                          <Button
                            variant={inCallControls.screen ? "default" : "outline"}
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            onClick={() => toggleControl('screen')}
                          >
                            <ScreenShare className="h-5 w-5" />
                          </Button>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="gap-1">
                              <Icon name="Settings" className="h-4 w-4" />
                              Расширенные настройки
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Настройки видеовстречи</DialogTitle>
                              <DialogDescription>
                                Настройте параметры вашей видеовстречи
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-sm text-muted-foreground text-center">
                                В данный момент эта функция находится в разработке.
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button onClick={startCall} className="w-full gap-1">
                      <Video className="h-4 w-4" />
                      Начать встречу
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="join" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Присоединиться к встрече</CardTitle>
                    <CardDescription>
                      Введите ID встречи, чтобы присоединиться к ней
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Введите ID встречи (например, ABC-123-XYZ)"
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        className="font-mono"
                      />
                      <Button onClick={() => joinCall(meetingId)}>
                        Присоединиться
                      </Button>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Настройки звонка</h4>
                      <div className="flex items-center gap-6">
                        <Button
                          variant={inCallControls.video ? "default" : "outline"}
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => toggleControl('video')}
                        >
                          {inCallControls.video ? (
                            <Video className="h-5 w-5" />
                          ) : (
                            <VideoOff className="h-5 w-5" />
                          )}
                        </Button>
                        
                        <Button
                          variant={inCallControls.audio ? "default" : "outline"}
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => toggleControl('audio')}
                        >
                          {inCallControls.audio ? (
                            <Mic className="h-5 w-5" />
                          ) : (
                            <MicOff className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Контакты</span>
                  <Badge variant="outline" className="font-normal">
                    {activeUsers.filter(u => u.status === "available").length} онлайн
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {activeUsers.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div 
                            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-1 ring-white ${
                              user.status === "available" ? "bg-green-500" :
                              user.status === "in-call" ? "bg-yellow-500" :
                              "bg-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.status === "available" ? "Доступен" :
                             user.status === "in-call" ? "В звонке" :
                             "Не беспокоить"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          disabled={user.status !== "available"}
                          onClick={() => callUser(user.id, user.name)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          disabled={user.status !== "available"}
                          onClick={() => callUser(user.id, user.name)}
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
