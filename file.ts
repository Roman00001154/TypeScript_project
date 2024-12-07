
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type TimeSlot =
  | "8:30-10:00"
  | "10:15-11:45"
  | "12:15-13:45"
  | "14:00-15:30"
  | "15:45-17:15";
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

type Professor = {
  id: number;
  name: string;
  department: string;
};

type Classroom = {
  number: string;
  capacity: number;
  hasProjector: boolean;
};

type Course = {
  id: number;
  name: string;
  type: CourseType;
};

type Lesson = {
  courseId: number;
  professorId: number;
  classroomNumber: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
};

type ScheduleConflict = {
  type: "ProfessorConflict" | "ClassroomConflict";
  lessonDetails: Lesson;
};

// Масиви даних
let professors: Professor[] = [];
let classrooms: Classroom[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = [];

// Функції для роботи з даними
const addProfessor = (professor: Professor): void => {
  professors.push(professor);
};

const addLesson = (lesson: Lesson): boolean => {
  const conflict = validateLesson(lesson);
  if (!conflict) {
    schedule.push(lesson);
    return true;
  }
  return false;
};

const findAvailableClassrooms = (
  timeSlot: TimeSlot,
  dayOfWeek: DayOfWeek
): string[] => {
  const occupied = schedule
    .filter((lesson) => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
    .map((lesson) => lesson.classroomNumber);

  return classrooms
    .map((classroom) => classroom.number)
    .filter((number) => !occupied.includes(number));
};

const getProfessorSchedule = (professorId: number): Lesson[] => {
  return schedule.filter((lesson) => lesson.professorId === professorId);
};

const validateLesson = (lesson: Lesson): ScheduleConflict | null => {
  const professorConflict = schedule.find(
    (l) =>
      l.professorId === lesson.professorId &&
      l.dayOfWeek === lesson.dayOfWeek &&
      l.timeSlot === lesson.timeSlot
  );

  if (professorConflict) {
    return {
      type: "ProfessorConflict",
      lessonDetails: professorConflict,
    };
  }

  const classroomConflict = schedule.find(
    (l) =>
      l.classroomNumber === lesson.classroomNumber &&
      l.dayOfWeek === lesson.dayOfWeek &&
      l.timeSlot === lesson.timeSlot
  );

  if (classroomConflict) {
    return {
      type: "ClassroomConflict",
      lessonDetails: classroomConflict,
    };
  }

  return null;
};

// Функції аналізу
const getClassroomUtilization = (classroomNumber: string): number => {
  const totalSlots = 5 * 5; // 5 днів на тиждень, 5 часових слотів
  const occupiedSlots = schedule.filter(
    (lesson) => lesson.classroomNumber === classroomNumber
  ).length;

  return (occupiedSlots / totalSlots) * 100;
};

const getMostPopularCourseType = (): CourseType => {
  const typeCounts: Record<CourseType, number> = {
    Lecture: 0,
    Seminar: 0,
    Lab: 0,
    Practice: 0,
  };

  schedule.forEach((lesson) => {
    const course = courses.find((course) => course.id === lesson.courseId);
    if (course) {
      typeCounts[course.type]++;
    }
  });

  return Object.entries(typeCounts).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0] as CourseType;
};

// Модифікація даних
const reassignClassroom = (lessonId: number, newClassroomNumber: string): boolean => {
  const lesson = schedule.find((l) => l.courseId === lessonId);
  if (!lesson) return false;

  const conflict = schedule.find(
    (l) =>
      l.classroomNumber === newClassroomNumber &&
      l.dayOfWeek === lesson.dayOfWeek &&
      l.timeSlot === lesson.timeSlot
  );

  if (!conflict) {
    lesson.classroomNumber = newClassroomNumber;
    return true;
  }
  return false;
};

const cancelLesson = (lessonId: number): void => {
  schedule = schedule.filter((lesson) => lesson.courseId !== lessonId);
};

// Тестові дані
professors.push({ id: 1, name: "Dr. Smith", department: "Math" });
professors.push({ id: 2, name: "Dr. Johnson", department: "Physics" });

classrooms.push({ number: "101", capacity: 30, hasProjector: true });
classrooms.push({ number: "102", capacity: 20, hasProjector: false });

courses.push({ id: 1, name: "Algebra", type: "Lecture" });
courses.push({ id: 2, name: "Quantum Mechanics", type: "Lab" });

addLesson({
  courseId: 1,
  professorId: 1,
  classroomNumber: "101",
  dayOfWeek: "Monday",
  timeSlot: "8:30-10:00",
});

addLesson({
  courseId: 2,
  professorId: 2,
  classroomNumber: "102",
  dayOfWeek: "Monday",
  timeSlot: "10:15-11:45",
});

// Виклики функцій
console.log(findAvailableClassrooms("8:30-10:00", "Monday")); // ["102"]
console.log(getProfessorSchedule(1)); // [{...Lesson}]
console.log(getClassroomUtilization("101")); // Відсоток використання
console.log(getMostPopularCourseType()); // "Lecture"
