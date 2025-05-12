
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface CreateRoomDialogProps {
  onCreateRoom: (roomData: any) => void;
}

export function CreateRoomDialog({ onCreateRoom }: CreateRoomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [maxUsers, setMaxUsers] = useState(8);
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateRoom = () => {
    if (!name.trim()) {
      toast({
        title: "Ошибка",
        description: "Название комнаты обязательно",
        variant: "destructive",
      });
      return;
    }

    if (isPrivate && !password.trim()) {
      toast({
        title: "Ошибка",
        description: "Для приватной комнаты необходим пароль",
        variant: "destructive",
      });
      return;
    }

    const roomData = {
      id: Date.now().toString(),
      name,
      description,
      isPrivate,
      password: isPrivate ? password : null,
      maxUsers,
      focusTime,
      breakTime,
      tags: tags.length > 0 ? tags : ["Общая"],
      createdBy: {
        id: user?.id || "guest",
        name: user?.name || "Гость",
        avatar: user?.avatar
      },
      currentUsers: [],
    };

    onCreateRoom(roomData);
    resetForm();
    setIsOpen(false);
  };

  const addTag = () => {
    if (tag.trim() && !tags.includes(tag.trim()) && tags.length < 5) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPassword("");
    setIsPrivate(false);
    setMaxUsers(8);
    setFocusTime(25);
    setBreakTime(5);
    setTags([]);
    setTag("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" /> Создать комнату
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Создать учебную комнату</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="room-name">Название комнаты*</Label>
            <Input
              id="room-name"
              placeholder="Например: Подготовка к экзамену по математике"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="room-description">Описание</Label>
            <Textarea
              id="room-description"
              placeholder="Расскажите о том, чем вы будете заниматься в этой комнате"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="room-private">Приватная комната</Label>
              <Switch
                id="room-private"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>
            {isPrivate && (
              <Input
                id="room-password"
                type="password"
                placeholder="Пароль для входа в комнату"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="max-users">Максимум участников: {maxUsers}</Label>
              <Slider
                id="max-users"
                min={2}
                max={12}
                step={1}
                value={[maxUsers]}
                onValueChange={(values) => setMaxUsers(values[0])}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="focus-time">Время фокусировки: {focusTime} мин</Label>
              <Slider
                id="focus-time"
                min={5}
                max={60}
                step={5}
                value={[focusTime]}
                onValueChange={(values) => setFocusTime(values[0])}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="break-time">Время перерыва: {breakTime} мин</Label>
            <Slider
              id="break-time"
              min={1}
              max={30}
              step={1}
              value={[breakTime]}
              onValueChange={(values) => setBreakTime(values[0])}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="room-tags">Теги (до 5)</Label>
            <div className="flex gap-2">
              <Input
                id="room-tags"
                placeholder="Добавьте теги через Enter"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addTag}
                disabled={!tag.trim() || tags.includes(tag.trim()) || tags.length >= 5}
              >
                Добавить
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((t, i) => (
                  <Badge key={i} variant="secondary" className="flex items-center gap-1">
                    {t}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeTag(t)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleCreateRoom}>
            Создать комнату
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateRoomDialog;
