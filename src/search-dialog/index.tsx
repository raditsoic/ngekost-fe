import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MessageSquare } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { MOCK_DATA } from '../browsemore';

const historyItems = [
  'Search apartments near campus...',
  'How hot is the campus area...',
  'Distance between campus and Mulyo...',
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (callback: () => void) => {
    onOpenChange(false);
    callback();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search properties, chats..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Properties">
          {MOCK_DATA.map((kost, i) => (
            <CommandItem
              key={i}
              value={kost.title + ' ' + kost.formatted_address}
              onSelect={() => handleSelect(() => navigate(`/kost/${i}`))}
            >
              <Building2 />
              <div className="flex flex-col">
                <span className="text-sm">{kost.title}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                  {kost.formatted_address}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Chat History">
          {historyItems.map((item, i) => (
            <CommandItem
              key={i}
              value={item}
              onSelect={() => handleSelect(() => navigate('/chat'))}
            >
              <MessageSquare />
              <span className="text-sm">{item}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
