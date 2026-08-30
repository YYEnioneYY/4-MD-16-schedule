import type {
  GroupScheduleResponse,
  LessonLocation,
  Subject,
  Teacher,
} from '../model/types';

const offlineLocation = (
  room: string,
): LessonLocation => ({
  format: 'OFFLINE',
  building: 'пр. Вознесенский, д. 46',
  room,
});

const onlineLocation: LessonLocation = {
  format: 'ONLINE',
  building: null,
  room: 'ДО',
};

const teachers = {
  mankov: {
    id: 'teacher-mankov',
    shortName: 'Маньков В.Д.',
  },

  sirotenko: {
    id: 'teacher-sirotenko',
    shortName: 'Сиротенко Н.С.',
  },

  egorov: {
    id: 'teacher-egorov',
    shortName: 'Егоров И.М.',
  },

  razuminin: {
    id: 'teacher-razuminin',
    shortName: 'Разуминин В.В.',
  },

  ermin: {
    id: 'teacher-ermin',
    shortName: 'Ермин Д.А.',
  },

  busygin: {
    id: 'teacher-busygin',
    shortName: 'Бусыгин К.Н.',
  },

  zurakhov: {
    id: 'teacher-zurakhov',
    shortName: 'Зурахов В.С.',
  },
} satisfies Record<string, Teacher>;

const subjects = {
  lifeSafety: {
    id: 'subject-life-safety',
    name: 'Безопасность жизнедеятельности',
    departmentCode: '18-ИХПЭ',
  },

  enterpriseManagement: {
    id: 'subject-enterprise-management',
    name: 'Основы управления предприятием',
    departmentCode: '20-ИСиЗИ',
  },

  informationSecurity: {
    id: 'subject-information-security',
    name: 'Защита информационных и телекоммуникационных систем',
    departmentCode: '20-ИСиЗИ',
  },

  mobileDevelopment: {
    id: 'subject-mobile-development',
    name: 'Создание мобильных приложений',
    departmentCode: '20-ИСиЗИ',
  },

  artificialIntelligence: {
    id: 'subject-artificial-intelligence',
    name: 'Системы искусственного интеллекта',
    departmentCode: '20-ИСиЗИ',
  },

  corporateNetworkSecurity: {
    id: 'subject-corporate-network-security',
    name: 'Безопасность корпоративных компьютерных сетей',
    departmentCode: '20-ИСиЗИ',
  },

  internetProgramming: {
    id: 'subject-internet-programming',
    name: 'Программирование в сети Интернет',
    departmentCode: '20-ИСиЗИ',
  },

  communicationSystems: {
    id: 'subject-communication-systems',
    name: 'Сети и системы коммуникаций',
    departmentCode: '20-ИСиЗИ',
  },
} satisfies Record<string, Subject>;

export const groupScheduleMock = {
  group: {
    id: 'group-4-md-16',
    name: '4-МД-16',
    institute: 'ИИТА',
    educationForm: 'ОО',
    course: 4,
    semester: 7,
  },

  lessons: [
    // Понедельник

    {
      id: 'lesson-001',
      subject: subjects.lifeSafety,
      teacher: teachers.mankov,
      lessonType: 'LECTURE',
      totalHours: 16,
      weekday: 'MONDAY',
      weekType: 'NUMERATOR',
      time: {
        start: '11:40',
        end: '13:05',
      },
      location: onlineLocation,
    },

    {
      id: 'lesson-002',
      subject: subjects.enterpriseManagement,
      teacher: teachers.sirotenko,
      lessonType: 'LECTURE',
      totalHours: 32,
      weekday: 'MONDAY',
      weekType: 'DENOMINATOR',
      time: {
        start: '16:55',
        end: '20:00',
      },
      location: offlineLocation('В 457'),
    },

    {
      id: 'lesson-003',
      subject: subjects.enterpriseManagement,
      teacher: teachers.sirotenko,
      lessonType: 'PRACTICE',
      totalHours: 16,
      weekday: 'MONDAY',
      weekType: 'DENOMINATOR',
      time: {
        start: '20:10',
        end: '21:40',
      },
      location: offlineLocation('В 457'),
    },

    // Вторник

    {
      id: 'lesson-004',
      subject: subjects.informationSecurity,
      teacher: teachers.egorov,
      lessonType: 'LECTURE',
      totalHours: 16,
      weekday: 'TUESDAY',
      weekType: 'NUMERATOR',
      time: {
        start: '10:05',
        end: '11:30',
      },
      location: offlineLocation('В 458'),
    },

    {
      id: 'lesson-005',
      subject: subjects.informationSecurity,
      teacher: teachers.egorov,
      lessonType: 'PRACTICE',
      totalHours: 16,
      weekday: 'TUESDAY',
      weekType: 'DENOMINATOR',
      time: {
        start: '10:05',
        end: '11:30',
      },
      location: offlineLocation('В 458'),
    },

    {
      id: 'lesson-006',
      subject: subjects.informationSecurity,
      teacher: teachers.egorov,
      lessonType: 'PRACTICE',
      totalHours: 32,
      weekday: 'TUESDAY',
      weekType: 'BOTH',
      time: {
        start: '11:40',
        end: '13:05',
      },
      location: offlineLocation('В 458'),
    },

    {
      id: 'lesson-007',
      subject: subjects.mobileDevelopment,
      teacher: teachers.razuminin,
      lessonType: 'LECTURE',
      totalHours: 16,
      weekday: 'TUESDAY',
      weekType: 'NUMERATOR',
      time: {
        start: '13:45',
        end: '15:10',
      },
      location: offlineLocation('В 458'),
    },

    {
      id: 'lesson-008',
      subject: subjects.mobileDevelopment,
      teacher: teachers.razuminin,
      lessonType: 'LABORATORY',
      totalHours: 16,
      weekday: 'TUESDAY',
      weekType: 'DENOMINATOR',
      time: {
        start: '13:45',
        end: '15:10',
      },
      location: offlineLocation('В 458'),
    },

    {
      id: 'lesson-009',
      subject: subjects.mobileDevelopment,
      teacher: teachers.razuminin,
      lessonType: 'PRACTICE',
      totalHours: 32,
      weekday: 'TUESDAY',
      weekType: 'BOTH',
      time: {
        start: '15:20',
        end: '16:45',
      },
      location: offlineLocation('В 458'),
    },

    // Среда

    {
      id: 'lesson-010',
      subject: subjects.artificialIntelligence,
      teacher: teachers.ermin,
      lessonType: 'LECTURE',
      totalHours: 16,
      weekday: 'WEDNESDAY',
      weekType: 'NUMERATOR',
      time: {
        start: '10:05',
        end: '11:30',
      },
      location: offlineLocation('В 457'),
    },

    {
      id: 'lesson-011',
      subject: subjects.artificialIntelligence,
      teacher: teachers.ermin,
      lessonType: 'LABORATORY',
      totalHours: 16,
      weekday: 'WEDNESDAY',
      weekType: 'DENOMINATOR',
      time: {
        start: '10:05',
        end: '11:30',
      },
      location: offlineLocation('В 457'),
    },

    {
      id: 'lesson-012',
      subject: subjects.artificialIntelligence,
      teacher: teachers.ermin,
      lessonType: 'PRACTICE',
      totalHours: 32,
      weekday: 'WEDNESDAY',
      weekType: 'BOTH',
      time: {
        start: '11:40',
        end: '13:05',
      },
      location: offlineLocation('В 457'),
    },

    {
      id: 'lesson-013',
      subject: subjects.lifeSafety,
      teacher: teachers.mankov,
      lessonType: 'PRACTICE',
      totalHours: 32,
      weekday: 'WEDNESDAY',
      weekType: 'BOTH',
      time: {
        start: '13:45',
        end: '15:10',
      },
      location: offlineLocation('В 572'),
    },

    {
      id: 'lesson-014',
      subject: subjects.lifeSafety,
      teacher: teachers.mankov,
      lessonType: 'LECTURE',
      totalHours: 16,
      weekday: 'WEDNESDAY',
      weekType: 'NUMERATOR',
      time: {
        start: '15:20',
        end: '16:45',
      },
      location: offlineLocation('В 338'),
    },

    // Четверг

    {
      id: 'lesson-015',
      subject: subjects.corporateNetworkSecurity,
      teacher: teachers.egorov,
      lessonType: 'LECTURE',
      totalHours: 16,
      weekday: 'THURSDAY',
      weekType: 'NUMERATOR',
      time: {
        start: '10:05',
        end: '11:30',
      },
      location: offlineLocation('В 458'),
    },

    {
      id: 'lesson-016',
      subject: subjects.corporateNetworkSecurity,
      teacher: teachers.egorov,
      lessonType: 'PRACTICE',
      totalHours: 32,
      weekday: 'THURSDAY',
      weekType: 'DENOMINATOR',
      time: {
        start: '10:05',
        end: '13:05',
      },
      location: offlineLocation('В 458'),
    },

    {
      id: 'lesson-017',
      subject: subjects.lifeSafety,
      teacher: teachers.mankov,
      lessonType: 'LABORATORY',
      totalHours: 16,
      weekday: 'THURSDAY',
      weekType: 'NUMERATOR',
      time: {
        start: '11:40',
        end: '13:05',
      },
      location: offlineLocation('В 570'),
    },

    {
      id: 'lesson-018',
      subject: subjects.internetProgramming,
      teacher: teachers.busygin,
      lessonType: 'LECTURE',
      totalHours: 32,
      weekday: 'THURSDAY',
      weekType: 'BOTH',
      time: {
        start: '13:45',
        end: '15:10',
      },
      location: offlineLocation('В 458'),
    },

    {
      id: 'lesson-019',
      subject: subjects.internetProgramming,
      teacher: teachers.busygin,
      lessonType: 'PRACTICE',
      totalHours: 32,
      weekday: 'THURSDAY',
      weekType: 'BOTH',
      time: {
        start: '15:20',
        end: '16:45',
      },
      location: offlineLocation('В 458'),
    },

    // Пятница

    {
      id: 'lesson-020',
      subject: subjects.communicationSystems,
      teacher: teachers.zurakhov,
      lessonType: 'LECTURE',
      totalHours: 16,
      weekday: 'FRIDAY',
      weekType: 'NUMERATOR',
      time: {
        start: '15:20',
        end: '16:45',
      },
      location: onlineLocation,
    },

    {
      id: 'lesson-021',
      subject: subjects.communicationSystems,
      teacher: teachers.zurakhov,
      lessonType: 'PRACTICE',
      totalHours: 32,
      weekday: 'FRIDAY',
      weekType: 'NUMERATOR',
      time: {
        start: '16:55',
        end: '20:00',
      },
      location: onlineLocation,
    },
  ],
} satisfies GroupScheduleResponse;