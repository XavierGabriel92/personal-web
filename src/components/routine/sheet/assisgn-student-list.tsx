import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  email?: string;
  avatar: string | null;
  programName: string | null;
}

interface StudentListProps {
  students: Student[];
  selectedIds: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
  title?: string;
}

export default function AssignStudentList({
  students,
  selectedIds,
  onSelectionChange,
  title,
}: StudentListProps) {
  const handleToggle = (studentId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    onSelectionChange(newSelected);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (students.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      )}
      <div className="space-y-2">
        {students.map((student) => (
          <label
            key={student.id}
            htmlFor={`student-${student.id}`}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent",
              selectedIds.has(student.id) && "bg-accent"
            )}
          >
            <Checkbox
              id={`student-${student.id}`}
              checked={selectedIds.has(student.id)}
              onCheckedChange={() => handleToggle(student.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <Avatar className="h-10 w-10">
              <AvatarImage src={student.avatar || undefined} alt={student.name} />
              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{student.name}</p>
              {student.programName && (
                <p className="text-xs text-muted-foreground truncate">
                  {student.programName}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

