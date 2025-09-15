import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isAfter, isBefore, parseISO, isToday } from 'date-fns';

export class AnalyticsService {
  // Calculate adherence percentage for a given period
  static calculateAdherenceRate(logs, medications, startDate, endDate) {
    if (!logs || logs.length === 0 || !medications || medications.length === 0) {
      return 0;
    }

    const period = eachDayOfInterval({ start: startDate, end: endDate });
    let totalExpected = period.length * medications.length;
    
    // Filter logs to the date range
    const periodLogs = logs.filter(log => {
      const logDate = parseISO(log.taken_at);
      return !isBefore(logDate, startDate) && !isAfter(logDate, endDate);
    });

    const adherenceRate = Math.round((periodLogs.length / totalExpected) * 100);
    return Math.min(adherenceRate, 100); // Cap at 100%
  }

  // Get daily adherence data for charts
  static getDailyAdherenceData(logs, medications, days = 7) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (days - 1));

    const period = eachDayOfInterval({ start: startDate, end: today });
    const dailyData = period.map(date => {
      const dayLogs = logs.filter(log => {
        const logDate = parseISO(log.taken_at);
        return format(logDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      const expectedForDay = medications.length;
      const actualForDay = dayLogs.length;
      const adherenceRate = expectedForDay > 0 ? Math.round((actualForDay / expectedForDay) * 100) : 0;

      return {
        date: format(date, 'MMM d'),
        fullDate: date,
        expected: expectedForDay,
        actual: actualForDay,
        adherenceRate: Math.min(adherenceRate, 100),
        logs: dayLogs
      };
    });

    return dailyData;
  }

  // Calculate streak (consecutive days with at least one log)
  static calculateStreak(logs) {
    if (!logs || logs.length === 0) return 0;

    // Sort logs by date (newest first)
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.taken_at) - new Date(a.taken_at)
    );

    // Get unique dates
    const uniqueDates = [...new Set(sortedLogs.map(log => 
      format(parseISO(log.taken_at), 'yyyy-MM-dd')
    ))].sort().reverse(); // Most recent first

    if (uniqueDates.length === 0) return 0;

    // Check if today has a log
    const today = format(new Date(), 'yyyy-MM-dd');
    let streak = 0;
    let currentDate = new Date();

    // If no log today, check yesterday to allow for late evening logging
    let checkDate = uniqueDates.includes(today) ? today : format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
    
    // Count consecutive days
    for (let i = 0; i < uniqueDates.length; i++) {
      const expectedDate = format(currentDate, 'yyyy-MM-dd');
      
      if (uniqueDates.includes(expectedDate)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // Get medication-specific adherence
  static getMedicationAdherence(logs, medications, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));

    return medications.map(medication => {
      const medLogs = logs.filter(log => 
        log.medication_id === medication.id && 
        !isBefore(parseISO(log.taken_at), startDate)
      );

      const adherenceRate = Math.round((medLogs.length / days) * 100);
      
      return {
        ...medication,
        logs: medLogs.length,
        adherenceRate: Math.min(adherenceRate, 100),
        lastTaken: medLogs.length > 0 ? medLogs[0].taken_at : null
      };
    });
  }

  // Get weekly summary data
  static getWeeklySummary(logs, medications) {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    const weekLogs = logs.filter(log => {
      const logDate = parseISO(log.taken_at);
      return !isBefore(logDate, weekStart) && !isAfter(logDate, weekEnd);
    });

    const totalExpected = medications.length * 7;
    const adherenceRate = totalExpected > 0 ? Math.round((weekLogs.length / totalExpected) * 100) : 0;

    return {
      period: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`,
      logs: weekLogs.length,
      expected: totalExpected,
      adherenceRate: Math.min(adherenceRate, 100),
      uniqueDays: [...new Set(weekLogs.map(log => 
        format(parseISO(log.taken_at), 'yyyy-MM-dd')
      ))].length
    };
  }

  // Get monthly trends for longer-term view
  static getMonthlyTrends(logs, medications, months = 3) {
    const trends = [];
    const today = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const monthLogs = logs.filter(log => {
        const logDate = parseISO(log.taken_at);
        return !isBefore(logDate, monthStart) && !isAfter(logDate, monthEnd);
      });

      const daysInMonth = monthEnd.getDate();
      const expectedLogs = medications.length * daysInMonth;
      const adherenceRate = expectedLogs > 0 ? Math.round((monthLogs.length / expectedLogs) * 100) : 0;

      trends.push({
        month: format(monthDate, 'MMM yyyy'),
        logs: monthLogs.length,
        expected: expectedLogs,
        adherenceRate: Math.min(adherenceRate, 100),
        daysWithLogs: [...new Set(monthLogs.map(log => 
          format(parseISO(log.taken_at), 'yyyy-MM-dd')
        ))].length
      });
    }

    return trends;
  }
}