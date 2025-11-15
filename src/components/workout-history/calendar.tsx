import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import * as React from "react"

interface WorkoutCalendarProps {
  selectedDates?: Date[]
  onDatesSelect?: (dates: Date[]) => void
  workoutDates?: Date[]
}

export function WorkoutCalendar({
  selectedDates,
  onDatesSelect,
}: WorkoutCalendarProps) {
  const [dates, setDates] = React.useState<Date[]>(selectedDates || [])

  const handleSelect = (selected: Date[] | undefined) => {
    setDates(selected || [])
    onDatesSelect?.(dates)
  }

  return (
    <Card>
      <CardContent>
        <div className="flex justify-center">
          <CalendarComponent
            mode="multiple"
            selected={dates}
            onSelect={handleSelect}
            className="p-0"
            components={{
              Nav: () => <div />,
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

