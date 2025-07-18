"use client";

import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { 
  MoreHorizontal, 
  GripVertical, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Minus,
  Flag
} from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Task } from '@/types/project';
import { useProjectStore } from '@/lib/store';

interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  onSelectionChange: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

function TaskRow({ task, isSelected, onSelectionChange, onEdit }: TaskRowProps) {
  const { updateTask } = useProjectStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusConfig = {
    'todo': { 
      icon: Minus, 
      color: 'bg-gray-100 text-gray-800 hover:bg-gray-200/90',
      iconColor: 'text-gray-500',
      label: 'To-Do'
    },
    'in-progress': { 
      icon: Clock, 
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-200/90',
      iconColor: 'text-blue-500',
      label: 'In Progress'
    },
    'completed': { 
      icon: CheckCircle2, 
      color: 'bg-green-100 text-green-800 hover:bg-green-200/90',
      iconColor: 'text-green-500',
      label: 'Done'
    }
  };

  const priorityConfig = {
    'low': 'bg-green-100 text-green-800 hover:bg-gray-100 hover:text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800 hover:bg-gray-100 hover:text-yellow-800',
    'high': 'bg-red-100 text-red-800 hover:bg-gray-100 hover:text-red-800'
  };

  const StatusIcon = statusConfig[task.status].icon;

  const handleStatusChange = (newStatus: Task['status']) => {
    updateTask(task.id, { status: newStatus });
  };

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style} 
      className={`${isDragging ? 'opacity-50' : ''} ${isSelected ? 'bg-muted/50' : ''}`}
    >
      <TableCell className="w-8 sm:w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelectionChange(task.id)}
        />
      </TableCell>
      
      <TableCell className="w-8 sm:w-12">
        <Button
          variant="ghost"
          size="sm"
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 h-6 w-6 sm:h-8 sm:w-8"
        >
          <GripVertical className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </TableCell>
      
      <TableCell className="font-medium min-w-[200px]">
        <div>
          <div className="font-medium text-sm sm:text-base">{task.title}</div>
          {task.description && (
            <div className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </div>
          )}
          {task.tags.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs hover:bg-gray-100 transition-colors duration-200 ease-in-out flex-shrink-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell className="min-w-[100px]">
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${statusConfig[task.status].iconColor}`} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-1 hover:bg-transparent"
              >
                <Badge className={`${statusConfig[task.status].color} cursor-pointer transition-all duration-200 ease-in-out hover:shadow-sm`}>
                  {statusConfig[task.status].label}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleStatusChange('todo')}>
                <Minus className="h-4 w-4 mr-2" />
                To-Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                <Clock className="h-4 w-4 mr-2" />
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Done
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
      
      <TableCell className="min-w-[80px]">
        <div className="flex items-center gap-2">
          <Flag className={`h-4 w-4 ${
            task.priority === 'low' ? 'text-green-500' : 
            task.priority === 'medium' ? 'text-yellow-500' : 
            'text-red-500'
          }`} />
          <Badge className={`${priorityConfig[task.priority]} cursor-default transition-all duration-200 ease-in-out hover:shadow-sm`}>
            {task.priority}
          </Badge>
        </div>
      </TableCell>
      
      <TableCell className="min-w-[120px] hidden sm:table-cell">
        {task.assignee ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {task.assignee.avatar || task.assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm truncate">{task.assignee.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Unassigned</span>
        )}
      </TableCell>
      
      <TableCell>
        {task.startDate ? (
          <span className="text-xs sm:text-sm whitespace-nowrap">{format(task.startDate, 'MMM dd')}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      
      <TableCell>
        {task.dueDate ? (
          <span className="text-xs sm:text-sm whitespace-nowrap">{format(task.dueDate, 'MMM dd')}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>Edit task</DropdownMenuItem>
            <DropdownMenuItem>Duplicate task</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

interface TaskTableProps {
  tasks: Task[];
  milestoneId: string;
  onTaskEdit: (task: Task) => void;
}

export function TaskTable({ tasks, milestoneId, onTaskEdit }: TaskTableProps) {
  const { selectedTaskIds, toggleTaskSelection, selectAllTasks, setSelectedTaskIds } = useProjectStore();
  
  const milestoneTasks = tasks.sort((a, b) => a.order - b.order);
  const selectedMilestoneTasks = milestoneTasks.filter(task => 
    selectedTaskIds.includes(task.id)
  );
  
  const isAllSelected = milestoneTasks.length > 0 && 
    selectedMilestoneTasks.length === milestoneTasks.length;
  const isPartiallySelected = selectedMilestoneTasks.length > 0 && 
    selectedMilestoneTasks.length < milestoneTasks.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all tasks in this milestone
      const remainingSelected = selectedTaskIds.filter(id => 
        !milestoneTasks.some(task => task.id === id)
      );
      setSelectedTaskIds(remainingSelected);
    } else {
      selectAllTasks(milestoneId);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 px-4 text-muted-foreground">
        <p>No tasks yet. Add your first task to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-8 sm:w-12">
            <Checkbox
              checked={isAllSelected}
              ref={ref => {
                if (ref) ref.indeterminate = isPartiallySelected;
              }}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          <TableHead className="w-8 sm:w-12"></TableHead>
          <TableHead className="min-w-[200px]">Task</TableHead>
          <TableHead className="min-w-[100px]">Status</TableHead>
          <TableHead className="min-w-[80px]">Priority</TableHead>
          <TableHead className="min-w-[120px] hidden sm:table-cell">Assignee</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead className="w-8 sm:w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <SortableContext items={milestoneTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {milestoneTasks.map((task) => (
            <TaskRow 
              key={task.id} 
              task={task} 
              isSelected={selectedTaskIds.includes(task.id)}
              onSelectionChange={toggleTaskSelection}
              onEdit={onTaskEdit}
            />
          ))}
        </SortableContext>
      </TableBody>
      </Table>
    </div>
  );
}