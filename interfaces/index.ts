// تعريف نوع للكتاب (Book)
export interface Book {
  id?: number; // لأن ID يتم توليده تلقائيًا
  name: string;
  author: string;
  category: string;
  editionYear: number;
  totalPages: number;
  createdAt?: Date; // يتم تحديدها تلقائيًا من قاعدة البيانات
  updatedAt?: Date; // يتم تحديثها تلقائيًا من قاعدة البيانات
}

// تعريف نوع للمستخدم (User)
export interface User {
  id?: number; // لأن ID يتم توليده تلقائيًا
  name: string;
  gender: string;
  region: string;
  readingChallenge: number; // تحدي القراءة الخاص بالمستخدم
  role: string;
  createdAt?: Date; // يتم تحديدها تلقائيًا من قاعدة البيانات
  updatedAt?: Date; // يتم تحديثها تلقائيًا من قاعدة البيانات
}

// تعريف نوع للتقرير اليومي (DailyReport)
export interface DailyReport {
  id?: number; // لأن ID يتم توليده تلقائيًا
  userId: number; // إشارة إلى معرف المستخدم
  bookId: number; // إشارة إلى معرف المستخدم
  readingDate: string; // تاريخ التقرير
  totalPagesRead: number; // عدد الصفحات التي قرأها المستخدم في اليوم
  finishedBooks: number; // عدد الكتب التي أنجزها المستخدم
  notes?: string; // ملاحظات إضافية
  createdAt?: Date; // يتم تحديدها تلقائيًا من قاعدة البيانات
  updatedAt?: Date; // يتم تحديثها تلقائيًا من قاعدة البيانات
}
