import { parse, formatISO, startOfDay, endOfDay } from 'date-fns'

export class DateFnsAdapter {
  static convertToISO (date: string) {
    const newDate = parse(date, 'dd/MM/yyyy', new Date())
    newDate.setHours(5)
    return formatISO(newDate)
  }

  static startOfDay (date: string) {
    return startOfDay(new Date(date))
  }

  static endOfDay (date: string) {
    return endOfDay(new Date(date))
  }
}