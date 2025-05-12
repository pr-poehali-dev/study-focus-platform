
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Clock, LockKeyhole, UserCheck, Timer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export interface RoomUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface RoomProps {
  id: string;
  name: string;
  description: string;
  currentUsers: RoomUser[];
  maxUsers: number;
  focusTime: number;
  breakTime: number;
  isPrivate: boolean;
  tags: string[];
  createdBy: RoomUser;
  onJoin: (roomId: string, password?: string) => void;
}

export function RoomCard({ 
  id, 
  name, 
  description, 
  currentUsers, 
  maxUsers, 
  focusTime, 
  breakTime,
  isPrivate,
  tags,
  createdBy,
  onJoin 
}: RoomProps) {
  const [password, setPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleJoinClick = () => {
    if (isPrivate) {
      setIsPasswordDialogOpen(true);
    } else {
      onJoin(id);
    }
  };

  const handlePasswordSubmit = () => {
    if (!password.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите пароль",
        variant: "destructive",
      });
      return;
    }
    
    onJoin(id, password);
    setPassword("");
    setIsPasswordDialogOpen(false);
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold group">
            {name}
            {isPrivate && <LockKeyhole className="inline-block ml-2 h-4 w-4 text-amber-500" />}
          </CardTitle>
          <Badge 
            variant={currentUsers.length < maxUsers ? "outline" : "secondary"}
            className="font-normal gap-1 flex items-center"
          >
            <Users className="h-3 w-3" /> {currentUsers.length}/{maxUsers}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2" title={description}>
          {description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, i) => (
            <Badge variant="secondary" key={i} className="text-xs bg-primary/10 hover:bg-primary/20">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1" title="Время фокусировки">
            <Timer className="h-3 w-3" /> {focusTime} мин
          </div>
          <div className="flex items-center gap-1" title="Время перерыва">
            <Clock className="h-3 w-3" /> {breakTime} мин
          </div>
        </div>
        
        <div className="flex -space-x-2 overflow-hidden">
          {currentUsers.map((user) => (
            <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-[10px]">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {currentUsers.length < maxUsers && (
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted border-2 border-background">
              <span className="text-[10px] text-muted-foreground font-medium">
                +{maxUsers - currentUsers.length}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Avatar className="h-5 w-5">
            <AvatarImage src={createdBy.avatar} alt={createdBy.name} />
            <AvatarFallback className="text-[10px]">
              {createdBy.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>Создал {createdBy.name}</span>
        </div>
        
        <Button 
          size="sm" 
          onClick={handleJoinClick}
          disabled={currentUsers.length >= maxUsers}
          className="gap-1"
        >
          <UserCheck className="h-4 w-4" />
          Присоединиться
        </Button>
      </CardFooter>

      {/* Диалог для ввода пароля */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Приватная комната</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Для входа в комнату "{name}" требуется пароль.
            </p>
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPasswordDialogOpen(false)} variant="outline">
              Отмена
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Войти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default RoomCard;
