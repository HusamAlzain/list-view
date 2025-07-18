import { Task } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Clock, 
  Minus,
  Flag,
  Calendar,
  User
} from 'lucide-react';

interface TaskDragOverlayProps {
  tasks: Task[];
}

export function TaskDragOverlay({ tasks }: TaskDragOverlayProps) {
  if (tasks.length === 0) return null;

  const statusConfig = {
    'todo': { 
      icon: Minus, 
      color: 'bg-gray-100 text-gray-800',
      iconColor: 'text-gray-500',
      label: 'To-Do'
    },
    'in-progress': { 
      icon: Clock, 
      color: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-500',
      label: 'In Progress'
    },
    'completed': { 
      icon: CheckCircle2, 
      color: 'bg-green-100 text-green-800',
      iconColor: 'text-green-500',
      label: 'Done'
    }
  };

  const priorityConfig = {
    'low': { color: 'bg-green-100 text-green-800', icon: 'text-green-500' },
    'medium': { color: 'bg-yellow-100 text-yellow-800', icon: 'text-yellow-500' },
    'high': { color: 'bg-red-100 text-red-800', icon: 'text-red-500' }
  };

  if (tasks.length === 1) {
    const task = tasks[0];
    const StatusIcon = statusConfig[task.status as keyof typeof statusConfig]?.icon || Minus;
    const statusInfo = statusConfig[task.status as keyof typeof statusConfig];
    const priorityInfo = priorityConfig[task.priority];

    return (
      <div className="bg-white border rounded-lg shadow-xl p-4 min-w-[400px] max-w-[500px] opacity-95 transform rotate-2">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm line-clamp-2 flex-1 mr-2">
              {task.title}
            </h4>
            <Flag className={`h-4 w-4 ${priorityInfo.icon} flex-shrink-0`} />
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-3 w-3 ${statusInfo?.iconColor}`} />
              <Badge className={`text-xs ${statusInfo?.color} cursor-default`}>
                {statusInfo?.label}
              </Badge>
              <Badge className={`text-xs ${priorityInfo.color} cursor-default`}>
                {task.priority}
              </Badge>
            </div>
            
            {task.assignee && (
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">
                    {task.assignee.avatar || task.assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(task.dueDate, 'MMM dd')}</span>
            </div>
          )}
          
          {task.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {task.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs cursor-default">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 3 && (
                <Badge variant="outline" className="text-xs cursor-default">
                  +{task.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Multiple tasks - show stacked cards
  return (
    <div className="relative">
      {tasks.slice(0, 3).map((task, index) => (
        <div
          key={task.id}
          className="bg-white border rounded-lg shadow-xl p-3 min-w-[350px] absolute opacity-90"
          style={{
            transform: `translate(${index * 4}px, ${index * 4}px) rotate(${index * 2}deg)`,
            zIndex: 10 - index,
          }}
        >
          <div className="space-y-2">
            <h4 className="font-medium text-sm line-clamp-1">
              {task.title}
            </h4>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${statusConfig[task.status as keyof typeof statusConfig]?.color} cursor-default`}>
                {statusConfig[task.status as keyof typeof statusConfig]?.label}
              </Badge>
              <Badge className={`text-xs ${priorityConfig[task.priority].color} cursor-default`}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </div>
      ))}
      
      {tasks.length > 3 && (
        <div
          className="bg-muted border rounded-lg shadow-xl p-3 min-w-[350px] absolute flex items-center justify-center"
          style={{
            transform: `translate(12px, 12px) rotate(6deg)`,
            zIndex: 7,
          }}
        >
          <span className="text-sm font-medium text-muted-foreground">
            +{tasks.length - 3} more tasks
          </span>
        </div>
      )}
      
      {/* Badge showing total count */}
      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-20">
        {tasks.length}
      </div>
    </div>
  );
}