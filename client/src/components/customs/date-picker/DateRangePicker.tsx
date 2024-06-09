import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { DateRangeInputs } from '@/hooks/apprentice/useFetchApprentices'
import { toast } from 'sonner'
import { Spinner } from '../spinner/Spinner'

type DatePickerWithRangeProps = {
    className?: React.HTMLAttributes<HTMLDivElement>
  refetch: (dates: DateRangeInputs) => void,
  isPending: boolean
}

export function DatePickerWithRange ({
  className,
  refetch,
  isPending
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  })

  const handleClick = () => {
    if (!date?.from || !date.to) {
      toast.error('Date is not set')
      return
    }
    const startDate = `${date.from.getFullYear()}-${date.from.getMonth() + 1}-${date.from.getDate()}`
    const end = new Date(date.to)
    end.setDate(end.getDate() + 1)
    const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
    refetch({
      startDate,
      endDate
    })
  }

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from
              ? (
                  date.to
                    ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
                      )
                    : (
                        format(date.from, 'LLL dd, y')
                      )
                )
              : (
              <span>Pick a date</span>
                )}
                  </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
          </Popover>
      <Button variant={'default'}
          disabled={isPending}
              onClick={handleClick}
      >
        {isPending
          ? <>
            <Spinner />{''}
            </>
          : 'Search'}
          </Button>
    </div>
  )
}
