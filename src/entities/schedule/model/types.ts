export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type WeekType =
  | 'NUMERATOR'
  | 'DENOMINATOR'
  | 'BOTH';

export type LessonType =
  | 'LECTURE'
  | 'PRACTICE'
  | 'LABORATORY';

export type LessonFormat =
  | 'OFFLINE'
  | 'ONLINE';

export interface StudyGroup {
  id: string;
  name: string;
  institute: string;
  educationForm: string;
  course: number;
  semester: number;
}

export interface Subject {
  id: string;
  name: string;
  departmentCode: string;
}

export interface Teacher {
  id: string;
  shortName: string;
}

export interface LessonTime {
  start: string;
  end: string;
}

export interface LessonLocation {
  format: LessonFormat;
  building: string | null;
  room: string | null;
}

export interface ScheduleLesson {
  id: string;

  subject: Subject;
  teacher: Teacher;

  lessonType: LessonType;
  totalHours: number;

  weekday: Weekday;
  weekType: WeekType;

  time: LessonTime;
  location: LessonLocation;
}

export interface GroupScheduleResponse {
  group: StudyGroup;
  lessons: ScheduleLesson[];
}