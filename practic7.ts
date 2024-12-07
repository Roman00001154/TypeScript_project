enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled",
  }
  
  enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special",
  }
  
  enum Semester {
    First = "First",
    Second = "Second",
  }
  
  enum GradeEnum {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2,
  }
  
  enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering",
  }
  
  // Interfaces
  interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
  }
  
  interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
  }
  
  interface Grade {
    studentId: number;
    courseId: number;
    grade: GradeEnum;
    date: Date;
    semester: Semester;
  }
  
  // University Management System Class
  class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: Grade[] = [];
    private studentIdCounter = 1;
    private courseRegistrations: Map<number, number[]> = new Map(); // Курс -> список студентів
  
    // Додавання студента
    enrollStudent(student: Omit<Student, "id">): Student {
      const newStudent: Student = { id: this.studentIdCounter++, ...student };
      this.students.push(newStudent);
      return newStudent;
    }
  
    // Реєстрація студента на курс
    registerForCourse(studentId: number, courseId: number): void {
      const student = this.students.find((s) => s.id === studentId);
      const course = this.courses.find((c) => c.id === courseId);
  
      if (!student || !course) {
        throw new Error("Студент або курс не знайдені.");
      }
  
      if (student.faculty !== course.faculty) {
        throw new Error("Студент не може зареєструватися на курс іншого факультету.");
      }
  
      const registeredStudents = this.courseRegistrations.get(courseId) || [];
      if (registeredStudents.length >= course.maxStudents) {
        throw new Error("Курс вже заповнений.");
      }
  
      registeredStudents.push(studentId);
      this.courseRegistrations.set(courseId, registeredStudents);
    }
  
    // Встановлення оцінки
    setGrade(studentId: number, courseId: number, grade: GradeEnum): void {
      const course = this.courseRegistrations.get(courseId);
      if (!course || !course.includes(studentId)) {
        throw new Error("Студент не зареєстрований на цей курс.");
      }
  
      const courseDetails = this.courses.find((c) => c.id === courseId);
      if (!courseDetails) {
        throw new Error("Курс не знайдений.");
      }
  
      const semester = courseDetails.semester;
  
      this.grades.push({
        studentId,
        courseId,
        grade,
        date: new Date(),
        semester,
      });
    }
  
    // Оновлення статусу студента
    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
      const student = this.students.find((s) => s.id === studentId);
      if (!student) {
        throw new Error("Студент не знайдений.");
      }
  
      student.status = newStatus;
    }
  
    // Отримання студентів за факультетом
    getStudentsByFaculty(faculty: Faculty): Student[] {
      return this.students.filter((student) => student.faculty === faculty);
    }
  
    // Отримання оцінок студента
    getStudentGrades(studentId: number): Grade[] {
      return this.grades.filter((grade) => grade.studentId === studentId);
    }
  
    // Доступні курси за факультетом та семестром
    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
      return this.courses.filter(
        (course) => course.faculty === faculty && course.semester === semester
      );
    }
  
    // Розрахунок середнього балу студента
    calculateAverageGrade(studentId: number): number {
      const studentGrades = this.getStudentGrades(studentId);
      if (studentGrades.length === 0) {
        return 0;
      }
  
      const total = studentGrades.reduce((sum, grade) => sum + grade.grade, 0);
      return total / studentGrades.length;
    }
  
    // Список відмінників по факультету
    getTopStudentsByFaculty(faculty: Faculty): Student[] {
      const studentsByFaculty = this.getStudentsByFaculty(faculty);
      return studentsByFaculty.filter(
        (student) => this.calculateAverageGrade(student.id) >= 4.5
      );
    }
  }
  
  // Приклад використання системи
  const ums = new UniversityManagementSystem();
  
  // Додати студентів
  const student1 = ums.enrollStudent({
    fullName: "Іван Іванов",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "CS-22",
  });
  
  const student2 = ums.enrollStudent({
    fullName: "Марія Петренко",
    faculty: Faculty.Economics,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "EC-11",
  });
  
  // Додати курси
  ums["courses"].push({
    id: 1,
    name: "Програмування",
    type: CourseType.Mandatory,
    credits: 4,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 30,
  });
  
  // Реєстрація на курс
  ums.registerForCourse(student1.id, 1);
  
  // Виставлення оцінок
  ums.setGrade(student1.id, 1, GradeEnum.Excellent);
  
  // Розрахунок середнього балу
  console.log("Середній бал:", ums.calculateAverageGrade(student1.id));
  