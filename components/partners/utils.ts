export const isPartnerOpen = (workingHours?: string): boolean | null => {
  if (!workingHours) return null;
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Yerevan',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    weekday: 'long',
  });

  const timeParts = formatter.formatToParts(now);
  const currentHours = parseInt(
    timeParts.find(p => p.type === 'hour')?.value || '0',
    10,
  );
  const currentMinutes = parseInt(
    timeParts.find(p => p.type === 'minute')?.value || '0',
    10,
  );
  const weekday = timeParts.find(p => p.type === 'weekday')?.value || '';

  const weekdayToNumber: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const currentDay = weekdayToNumber[weekday] ?? now.getDay();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;
  const dayMap: Record<number, string[]> = {
    0: ['Sunday', 'Sun'],
    1: ['Monday', 'Mon'],
    2: ['Tuesday', 'Tue'],
    3: ['Wednesday', 'Wed'],
    4: ['Thursday', 'Thu'],
    5: ['Friday', 'Fri'],
    6: ['Saturday', 'Sat'],
  };

  const currentDayNames = dayMap[currentDay] || [];

  if (!workingHours.includes(',')) {
    const timePart = workingHours.trim();
    return checkTimeRange(timePart, currentTimeInMinutes);
  }

  const parts = workingHours.split(',').map(item => item.trim());

  for (const part of parts) {
    const colonIndex = part.indexOf(':');
    if (colonIndex <= 0) continue;

    const daysPart = part.substring(0, colonIndex).trim();
    const timePart = part.substring(colonIndex + 1).trim();
    const dayMatches = isDayMatch(daysPart, currentDayNames);
    if (dayMatches) {
      const timeMatches = checkTimeRange(timePart, currentTimeInMinutes);
      return timeMatches;
    }
  }
  return null;
};

const isDayMatch = (daysPart: string, currentDayNames: string[]): boolean => {
  const normalizedDaysPart = daysPart.replace(/[–—]/g, '-');
  const daysLower = normalizedDaysPart.toLowerCase();

  const rangeMatch = normalizedDaysPart.match(/(\w+)\s*-\s*(\w+)/i);
  if (rangeMatch) {
    const startDay = rangeMatch[1].toLowerCase();
    const endDay = rangeMatch[2].toLowerCase();

    const dayOrder = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    const startIndex = dayOrder.findIndex(d => d.startsWith(startDay));
    const endIndex = dayOrder.findIndex(d => d.startsWith(endDay));
    const currentIndex = dayOrder.findIndex(d =>
      currentDayNames.some(cd => d.startsWith(cd.toLowerCase())),
    );

    if (startIndex !== -1 && endIndex !== -1 && currentIndex !== -1) {
      if (startIndex <= endIndex) {
        return currentIndex >= startIndex && currentIndex <= endIndex;
      } else {
        return currentIndex >= startIndex || currentIndex <= endIndex;
      }
    }
  }

  for (const dayName of currentDayNames) {
    const dayNameLower = dayName.toLowerCase();
    const regex = new RegExp(`\\b${dayNameLower}\\b`, 'i');
    if (regex.test(daysLower)) {
      return true;
    }
  }

  return false;
};

const checkTimeRange = (
  timeRange: string,
  currentTimeInMinutes: number,
): boolean => {
  const normalizedTimeRange = timeRange
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ');

  const timeMatch = normalizedTimeRange.match(
    /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/,
  );
  if (!timeMatch) {
    return false;
  }

  const startHours = parseInt(timeMatch[1], 10);
  const startMinutes = parseInt(timeMatch[2], 10);
  const endHours = parseInt(timeMatch[3], 10);
  const endMinutes = parseInt(timeMatch[4], 10);

  const startTimeInMinutes = startHours * 60 + startMinutes;
  const endTimeInMinutes = endHours * 60 + endMinutes;

  if (endTimeInMinutes < startTimeInMinutes) {
    const result =
      currentTimeInMinutes >= startTimeInMinutes ||
      currentTimeInMinutes < endTimeInMinutes;
    return result;
  } else {
    const result =
      currentTimeInMinutes >= startTimeInMinutes &&
      currentTimeInMinutes < endTimeInMinutes;
    return result;
  }
};

const dayTranslations: Record<string, Record<string, string>> = {
  en: {
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sunday: 'Sunday',
    Mon: 'Mon',
    Tue: 'Tue',
    Wed: 'Wed',
    Thu: 'Thu',
    Fri: 'Fri',
    Sat: 'Sat',
    Sun: 'Sun',
  },
  ru: {
    Monday: 'Понедельник',
    Tuesday: 'Вторник',
    Wednesday: 'Среда',
    Thursday: 'Четверг',
    Friday: 'Пятница',
    Saturday: 'Суббота',
    Sunday: 'Воскресенье',
    Mon: 'Пн',
    Tue: 'Вт',
    Wed: 'Ср',
    Thu: 'Чт',
    Fri: 'Пт',
    Sat: 'Сб',
    Sun: 'Вс',
  },
  hy: {
    Monday: 'Երկուշաբթի',
    Tuesday: 'Երեքշաբթի',
    Wednesday: 'Չորեքշաբթի',
    Thursday: 'Հինգշաբթի',
    Friday: 'Ուրբաթ',
    Saturday: 'Շաբաթ',
    Sunday: 'Կիրակի',
    Mon: 'Երկ',
    Tue: 'Երք',
    Wed: 'Չոր',
    Thu: 'Հնգ',
    Fri: 'Ուրբ',
    Sat: 'Շաբ',
    Sun: 'Կիր',
  },
};

export const formatWorkingHours = (
  workingHours?: string,
  locale: string = 'en',
): Array<{ days: string; time: string }> => {
  if (!workingHours) return [];
  const result: Array<{ days: string; time: string }> = [];

  const translateDay = (day: string): string => {
    const translations = dayTranslations[locale] || dayTranslations.en;
    return translations[day] || day;
  };

  if (!workingHours.includes(',')) {
    const trimmed = workingHours.trim();
    const colonIndex = trimmed.indexOf(':');
    const timePart =
      colonIndex > 0 ? trimmed.substring(colonIndex + 1).trim() : trimmed;

    const weekRange = `${translateDay('Monday')} - ${translateDay('Sunday')}`;
    result.push({ days: weekRange, time: timePart });
    return result;
  }

  const parts = workingHours.split(',').map(item => item.trim());

  parts.forEach(part => {
    const colonIndex = part.indexOf(':');
    if (colonIndex > 0) {
      const daysPart = part.substring(0, colonIndex).trim();
      const timePart = part.substring(colonIndex + 1).trim();

      let translatedDays = daysPart;
      const dayNames = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun',
      ];

      dayNames.forEach(day => {
        const regex = new RegExp(day, 'gi');
        translatedDays = translatedDays.replace(regex, translateDay(day));
      });

      result.push({ days: translatedDays, time: timePart });
    }
  });

  return result;
};




