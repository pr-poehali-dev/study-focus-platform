
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import RoomCard, { RoomProps } from "@/components/rooms/RoomCard";
import CreateRoomDialog from "@/components/rooms/CreateRoomDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Моковые данные для комнат
const initialRooms: RoomProps[] = [
  {
    id: "1",
    name: "Подготовка к ЕГЭ по математике",
    description: "Решаем сложные задачи из ЕГЭ по математике. Заходите, если готовитесь к экзамену!",
    currentUsers: [
      { id: "101", name: "Александр", avatar: "https://i.pravatar.cc/150?img=51" },
      { id: "102", name: "Мария", avatar: "https://i.pravatar.cc/150?img=43" },
      { id: "103", name: "Дмитрий", avatar: "https://i.pravatar.cc/150?img=53" },
    ],
    maxUsers: 8,
    focusTime: 30,
    breakTime: 5,
    isPrivate: false,
    tags: ["Математика", "ЕГЭ", "Учеба"],
    createdBy: { id: "101", name: "Александр", avatar: "https://i.pravatar.cc/150?img=51" },
    onJoin: () => {}
  },
  {
    id: "2",
    name: "Программирование на Python",
    description: "Изучаем Python вместе. Сейчас работаем над алгоритмами и структурами данных. Присоединяйтесь!",
    currentUsers: [
      { id: "201", name: "Иван", avatar: "https://i.pravatar.cc/150?img=39" },
      { id: "202", name: "Анна", avatar: "https://i.pravatar.cc/150?img=44" },
    ],
    maxUsers: 6,
    focusTime: 40,
    breakTime: 10,
    isPrivate: false,
    tags: ["Python", "Программирование", "Алгоритмы"],
    createdBy: { id: "201", name: "Иван", avatar: "https://i.pravatar.cc/150?img=39" },
    onJoin: () => {}
  },
  {
    id: "3",
    name: "Английский язык: подготовка к IELTS",
    description: "Готовимся к IELTS, практикуем разговорную речь и письмо. Нужен средний уровень знания языка.",
    currentUsers: [
      { id: "301", name: "Екатерина", avatar: "https://i.pravatar.cc/150?img=45" },
      { id: "302", name: "Сергей", avatar: "https://i.pravatar.cc/150?img=50" },
      { id: "303", name: "Николай", avatar: "https://i.pravatar.cc/150?img=53" },
      { id: "304", name: "Ольга", avatar: "https://i.pravatar.cc/150?img=44" }
    ],
    maxUsers: 6,
    focusTime: 25,
    breakTime: 5,
    isPrivate: true,
    tags: ["Английский", "IELTS", "Языки"],
    createdBy: { id: "301", name: "Екатерина", avatar: "https://i.pravatar.cc/150?img=45" },
    onJoin: () => {}
  },
  {
    id: "4",
    name: "Дизайн интерфейсов",
    description: "Обсуждаем UI/UX дизайн, делимся опытом и работаем над собственными проектами. Все уровни приветствуются!",
    currentUsers: [
      { id: "401", name: "Алексей", avatar: "https://i.pravatar.cc/150?img=49" },
      { id: "402", name: "Татьяна", avatar: "https://i.pravatar.cc/150?img=47" }
    ],
    maxUsers: 10,
    focusTime: 45,
    breakTime: 15,
    isPrivate: false,
    tags: ["Дизайн", "UI/UX", "Интерфейсы"],
    createdBy: { id: "401", name: "Алексей", avatar: "https://i.pravatar.cc/150?img=49" },
    onJoin: () => {}
  },
  {
    id: "5",
    name: "Творческое писательство",
    description: "Пишем рассказы, делимся идеями и критикой. Каждый день новое задание для развития творческого мышления.",
    currentUsers: [
      { id: "501", name: "Елена", avatar: "https://i.pravatar.cc/150?img=41" }
    ],
    maxUsers: 5,
    focusTime: 35,
    breakTime: 10,
    isPrivate: false,
    tags: ["Писательство", "Творчество", "Литература"],
    createdBy: { id: "501", name: "Елена", avatar: "https://i.pravatar.cc/150?img=41" },
    onJoin: () => {}
  },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Загружаем комнаты при монтировании
  useEffect(() => {
    // В реальном проекте здесь был бы API запрос
    const loadedRooms = initialRooms.map(room => ({
      ...room,
      onJoin: handleJoinRoom
    }));
    setRooms(loadedRooms);
  }, []);

  // Редирект неавторизованных пользователей
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Для доступа к учебным залам необходимо войти в аккаунт.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  // Функция подключения к комнате
  const handleJoinRoom = (roomId: string, password?: string) => {
    const room = rooms.find(r => r.id === roomId);
    
    if (!room) {
      toast({
        title: "Ошибка",
        description: "Комната не найдена",
        variant: "destructive"
      });
      return;
    }

    if (room.isPrivate && room.password !== password) {
      toast({
        title: "Ошибка",
        description: "Неверный пароль",
        variant: "destructive"
      });
      return;
    }

    if (room.currentUsers.length >= room.maxUsers) {
      toast({
        title: "Комната заполнена",
        description: "Достигнуто максимальное количество участников",
        variant: "destructive"
      });
      return;
    }

    // Добавляем пользователя в комнату
    const updatedRooms = rooms.map(r => {
      if (r.id === roomId && !r.currentUsers.some(u => u.id === user?.id)) {
        return {
          ...r,
          currentUsers: [
            ...r.currentUsers,
            {
              id: user?.id || "guest",
              name: user?.name || "Гость",
              avatar: user?.avatar
            }
          ]
        };
      }
      return r;
    });

    setRooms(updatedRooms);
    
    // В реальном приложении тут был бы редирект в комнату
    toast({
      title: "Успешно!",
      description: `Вы присоединились к комнате "${room.name}"`,
    });

    // Тут бы перенаправляли в комнату
    // navigate(`/rooms/${roomId}`);
  };

  // Функция создания комнаты
  const handleCreateRoom = (roomData: any) => {
    const newRoom = {
      ...roomData,
      onJoin: handleJoinRoom,
      currentUsers: [
        {
          id: user?.id || "guest",
          name: user?.name || "Гость",
          avatar: user?.avatar
        }
      ]
    };
    
    setRooms([newRoom, ...rooms]);
    
    toast({
      title: "Комната создана",
      description: `Комната "${roomData.name}" успешно создана`,
    });
  };

  // Фильтрация комнат
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "my") return matchesSearch && room.currentUsers.some(u => u.id === user?.id);
    if (activeTab === "open") return matchesSearch && !room.isPrivate;
    if (activeTab === "private") return matchesSearch && room.isPrivate;
    
    return matchesSearch;
  });

  if (!isAuthenticated) {
    return null; // Не рендерим страницу для неавторизованных пользователей
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Учебные залы</h1>
            <p className="text-muted-foreground">
              Присоединяйтесь к существующим комнатам или создавайте свои для совместного обучения
            </p>
          </div>
          <CreateRoomDialog onCreateRoom={handleCreateRoom} />
        </div>

        <div className="mb-6">
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию, описанию или тегам..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Icon name="LayoutGrid" className="h-4 w-4" />
              <span>Все</span>
            </TabsTrigger>
            <TabsTrigger value="my" className="flex items-center gap-1">
              <Icon name="UserCheck" className="h-4 w-4" />
              <span>Мои</span>
            </TabsTrigger>
            <TabsTrigger value="open" className="flex items-center gap-1">
              <Icon name="Unlock" className="h-4 w-4" />
              <span>Открытые</span>
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-1">
              <Icon name="Lock" className="h-4 w-4" />
              <span>Приватные</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} {...room} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Search" className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-lg font-medium">Комнаты не найдены</h3>
                <p className="mt-2 text-muted-foreground">
                  Попробуйте изменить параметры поиска или создайте свою комнату
                </p>
                <Button className="mt-4" onClick={() => setSearchQuery("")}>
                  Сбросить поиск
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my" className="mt-0">
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} {...room} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Users" className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-lg font-medium">Вы не присоединились ни к одной комнате</h3>
                <p className="mt-2 text-muted-foreground">
                  Присоединитесь к существующим комнатам или создайте свою
                </p>
                <Button className="mt-4" onClick={() => setActiveTab("all")}>
                  Показать все комнаты
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="open" className="mt-0">
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} {...room} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Unlock" className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-lg font-medium">Открытые комнаты не найдены</h3>
                <p className="mt-2 text-muted-foreground">
                  Попробуйте изменить параметры поиска или создайте свою комнату
                </p>
                <Button className="mt-4" onClick={() => setSearchQuery("")}>
                  Сбросить поиск
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="private" className="mt-0">
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} {...room} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Lock" className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-lg font-medium">Приватные комнаты не найдены</h3>
                <p className="mt-2 text-muted-foreground">
                  Попробуйте изменить параметры поиска или создайте свою приватную комнату
                </p>
                <Button className="mt-4" onClick={() => setSearchQuery("")}>
                  Сбросить поиск
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
