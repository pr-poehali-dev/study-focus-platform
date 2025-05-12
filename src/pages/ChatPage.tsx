
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isMe: boolean;
}

// Моковые данные сообщений
const initialMessages: Message[] = [
  {
    id: "1",
    text: "Привет! Как проходит подготовка к экзаменам?",
    sender: {
      id: "101",
      name: "Александр",
      avatar: "https://i.pravatar.cc/150?img=51"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 часа назад
    isMe: false
  },
  {
    id: "2",
    text: "Привет! Всё идёт по плану. Читаю учебники и решаю задачи.",
    sender: {
      id: "102",
      name: "Мария",
      avatar: "https://i.pravatar.cc/150?img=43"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 часа назад
    isMe: false
  },
  {
    id: "3",
    text: "Кто-нибудь разбирается в интегралах? Застрял на задаче №15.",
    sender: {
      id: "103",
      name: "Дмитрий",
      avatar: "https://i.pravatar.cc/150?img=53"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
    isMe: false
  },
  {
    id: "4",
    text: "Я могу помочь. Отправь задачу в личные сообщения.",
    sender: {
      id: "104",
      name: "Екатерина",
      avatar: "https://i.pravatar.cc/150?img=45"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 минут назад
    isMe: false
  },
  {
    id: "5",
    text: "Кто сегодня планирует долго заниматься? Может, создадим учебный зал?",
    sender: {
      id: "105",
      name: "Иван",
      avatar: "https://i.pravatar.cc/150?img=39"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 минут назад
    isMe: false
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Загрузка сообщений
  useEffect(() => {
    // В реальном проекте здесь был бы API запрос
    const updatedMessages = initialMessages.map(message => ({
      ...message,
      isMe: message.sender.id === user?.id
    }));
    setMessages(updatedMessages);
  }, [user?.id]);

  // Редирект неавторизованных пользователей
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Для доступа к чату необходимо войти в аккаунт.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Отправка сообщения
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: {
        id: user?.id || "guest",
        name: user?.name || "Гость",
        avatar: user?.avatar
      },
      timestamp: new Date(),
      isMe: true
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  // Форматирование времени
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Только что";
    if (diffMins < 60) return `${diffMins} мин. назад`;
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (!isAuthenticated) {
    return null; // Не рендерим страницу для неавторизованных пользователей
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Сайдбар с информацией */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">Общий чат</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Онлайн: {onlineUsers}</span>
                </div>
                
                <div className="text-sm text-muted-foreground mb-4">
                  <p>В общем чате вы можете:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Задавать вопросы по учебе</li>
                    <li>Искать партнеров для совместных занятий</li>
                    <li>Делиться полезными материалами</li>
                    <li>Общаться на академические темы</li>
                  </ul>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Правила чата:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Будьте вежливы и уважительны</li>
                    <li>Избегайте спама и рекламы</li>
                    <li>Не обсуждайте неакадемические темы</li>
                    <li>Сообщения удаляются через 24 часа</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Основная область чата */}
          <div className="md:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-xl">Сообщения</CardTitle>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4 h-[500px]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`flex max-w-[80%] ${
                          message.isMe 
                            ? 'flex-row-reverse items-start' 
                            : 'items-start'
                        }`}
                      >
                        <Avatar className={`h-8 w-8 ${message.isMe ? 'ml-2' : 'mr-2'}`}>
                          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                          <AvatarFallback>
                            {message.sender.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div 
                            className={`rounded-lg px-3 py-2 text-sm ${
                              message.isMe 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            {!message.isMe && (
                              <div className="font-medium text-xs mb-1">
                                {message.sender.name}
                              </div>
                            )}
                            <p>{message.text}</p>
                          </div>
                          <div 
                            className={`text-xs text-muted-foreground mt-1 ${
                              message.isMe ? 'text-right' : ''
                            }`}
                          >
                            {formatMessageTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <CardContent className="border-t p-4 mt-auto">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Введите сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    Отправить
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
