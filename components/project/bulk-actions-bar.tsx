"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Move, MoreHorizontal, X } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkEdit: () => void;
  onBulkDelete: () => void;
  onBulkMove: () => void;
  onClearSelection: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onBulkEdit,
  onBulkDelete,
  onBulkMove,
  onClearSelection
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground rounded-lg shadow-lg p-3 flex items-center gap-3 z-50 animate-in slide-in-from-bottom-2">
      <Badge variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors duration-200 ease-in-out">
        {selectedCount} selected
      </Badge>
      
      <Button variant="ghost" size="sm" onClick={onBulkEdit} className="text-primary-foreground hover:bg-primary-foreground/20 transition-colors duration-200 ease-in-out">
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
      
      <Button variant="ghost" size="sm" onClick={onBulkMove} className="text-primary-foreground hover:bg-primary-foreground/20 transition-colors duration-200 ease-in-out">
        <Move className="h-4 w-4 mr-2" />
        Move
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20 transition-colors duration-200 ease-in-out">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onBulkDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button variant="ghost" size="sm" onClick={onClearSelection} className="text-primary-foreground hover:bg-primary-foreground/20 transition-colors duration-200 ease-in-out">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}