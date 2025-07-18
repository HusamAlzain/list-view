"use client";

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useProjectStore } from '@/lib/store';

export function FilterBar() {
  const { filters, setFilters, users } = useProjectStore();
  const [searchValue, setSearchValue] = useState(filters.search);

  const statusOptions = [
    { value: 'todo', label: 'To-Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Done' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setFilters({ search: value });
  };

  const handleStatusFilter = (status: string, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    setFilters({ status: newStatus });
  };

  const handleAssigneeFilter = (assigneeId: string, checked: boolean) => {
    const newAssignees = checked
      ? [...filters.assignees, assigneeId]
      : filters.assignees.filter(a => a !== assigneeId);
    setFilters({ assignees: newAssignees });
  };

  const handlePriorityFilter = (priority: string, checked: boolean) => {
    const newPriority = checked
      ? [...filters.priority, priority]
      : filters.priority.filter(p => p !== priority);
    setFilters({ priority: newPriority });
  };

  const clearAllFilters = () => {
    setFilters({
      status: [],
      assignees: [],
      priority: [],
      search: '',
      showCompleted: true
    });
    setSearchValue('');
  };

  const activeFilterCount = 
    filters.status.length + 
    filters.assignees.length + 
    filters.priority.length + 
    (filters.search ? 1 : 0);

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4 p-4 bg-muted/30 rounded-lg border">
      <div className="relative flex-1 min-w-0 sm:min-w-[300px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="transition-colors duration-200 ease-in-out hover:bg-gray-50 flex-shrink-0">
            <Filter className="h-4 w-4 mr-2" />
            Status
            {filters.status.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1 text-xs hover:bg-gray-200 transition-colors duration-200 ease-in-out">
                {filters.status.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Filter by Status</h4>
            {statusOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={filters.status.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleStatusFilter(option.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`status-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:text-gray-700 transition-colors duration-200 ease-in-out cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="transition-colors duration-200 ease-in-out hover:bg-gray-50 flex-shrink-0">
            Assignee
            {filters.assignees.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1 text-xs hover:bg-gray-200 transition-colors duration-200 ease-in-out">
                {filters.assignees.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Filter by Assignee</h4>
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`assignee-${user.id}`}
                  checked={filters.assignees.includes(user.id)}
                  onCheckedChange={(checked) => 
                    handleAssigneeFilter(user.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={`assignee-${user.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:text-gray-700 transition-colors duration-200 ease-in-out cursor-pointer"
                >
                  {user.name}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="transition-colors duration-200 ease-in-out hover:bg-gray-50 flex-shrink-0">
            Priority
            {filters.priority.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1 text-xs hover:bg-gray-200 transition-colors duration-200 ease-in-out">
                {filters.priority.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Filter by Priority</h4>
            {priorityOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`priority-${option.value}`}
                  checked={filters.priority.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handlePriorityFilter(option.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`priority-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:text-gray-700 transition-colors duration-200 ease-in-out cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-muted-foreground hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 ease-in-out flex-shrink-0"
        >
          <X className="h-4 w-4 mr-1" />
          Clear ({activeFilterCount})
        </Button>
      )}
      </div>
    </div>
  );
}