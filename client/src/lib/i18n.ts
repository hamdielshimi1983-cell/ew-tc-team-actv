export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    createRequest: "Create Request",
    mediabuyer: "Media Buyer",
    briefs: "Briefs",
    activityLog: "Activity Log",
    logout: "Logout",
    
    // Dashboard
    marketingRequests: "Marketing Requests",
    manageAndTrack: "Manage and track all marketing material submissions",
    newRequest: "New Request",
    pending: "Pending",
    inReview: "In Review",
    approved: "Approved",
    rejected: "Rejected",
    returned: "Returned",
    backForUpdate: "Back for Update",
    closed: "Closed",
    allRequests: "All Requests",
    noRequests: "No requests found",
    createFirst: "Create your first marketing request",
    
    // Create Request
    createNewRequest: "Create New Request",
    submitMarketing: "Submit your marketing material for review and approval",
    requestDetails: "Request Details",
    fillInformation: "Fill in the information about your marketing material",
    requestTitle: "Request Title",
    description: "Description",
    materialType: "Material Type",
    targetAudience: "Target Audience",
    deadline: "Deadline",
    attachments: "Attachments (Optional)",
    cancel: "Cancel",
    createBtn: "Create Request",
    creating: "Creating...",
    
    // Approval Actions
    approve: "Approve",
    reject: "Reject",
    requestChanges: "Request Changes",
    return: "Return",
    publish: "Publish",
    closed: "Closed",
    
    // Feedback
    feedbackComment: "Feedback Comment",
    enterFeedback: "Enter your feedback...",
    submit: "Submit",
    
    // Media Buyer
    mediaBuyerDashboard: "Media Buyer Dashboard",
    approvedQueue: "Approved Queue",
    campaignCommandCenter: "Campaign Command Center",
    budgetTracking: "Budget Tracking",
    cplHealth: "CPL Health",
    currentSpend: "Current Spend",
    budgetLimit: "Budget Limit",
    cpl: "CPL",
    dailyReport: "Daily Report",
    campaignName: "Campaign Name",
    statusUpdate: "Status Update",
    
    // Brief Board
    briefBoard: "Brief Board",
    createBrief: "Create Brief",
    briefTitle: "Brief Title",
    assignTo: "Assign To",
    markSeen: "Mark as Seen",
    briefSeen: "Brief Seen",
    
    // Activity Log
    globalActivityLog: "Global Activity Log",
    action: "Action",
    user: "User",
    timestamp: "Timestamp",
    details: "Details",
    
    // Status Messages
    statusChanged: "Status Changed",
    uploadedBy: "Uploaded by",
    approvedBy: "Approved by",
    publishedAt: "Published at",
    
    // Common
    back: "Back",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    loading: "Loading...",
    error: "Error",
    success: "Success",
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    createRequest: "إنشاء طلب",
    mediabuyer: "مشتري الإعلانات",
    briefs: "الملخصات",
    activityLog: "سجل النشاط",
    logout: "تسجيل الخروج",
    
    // Dashboard
    marketingRequests: "طلبات التسويق",
    manageAndTrack: "إدارة وتتبع جميع طلبات المواد التسويقية",
    newRequest: "طلب جديد",
    pending: "قيد الانتظار",
    inReview: "قيد المراجعة",
    approved: "موافق عليه",
    rejected: "مرفوض",
    returned: "مرتجع",
    backForUpdate: "العودة للتحديث",
    closed: "مغلق",
    allRequests: "جميع الطلبات",
    noRequests: "لم يتم العثور على طلبات",
    createFirst: "أنشئ طلب التسويق الأول الخاص بك",
    
    // Create Request
    createNewRequest: "إنشاء طلب جديد",
    submitMarketing: "قدم مادتك التسويقية للمراجعة والموافقة",
    requestDetails: "تفاصيل الطلب",
    fillInformation: "ملء المعلومات حول مادتك التسويقية",
    requestTitle: "عنوان الطلب",
    description: "الوصف",
    materialType: "نوع المادة",
    targetAudience: "الجمهور المستهدف",
    deadline: "الموعد النهائي",
    attachments: "المرفقات (اختياري)",
    cancel: "إلغاء",
    createBtn: "إنشاء طلب",
    creating: "جاري الإنشاء...",
    
    // Approval Actions
    approve: "موافقة",
    reject: "رفض",
    requestChanges: "طلب تغييرات",
    return: "إرجاع",
    publish: "نشر",
    closed: "مغلق",
    
    // Feedback
    feedbackComment: "تعليق الملاحظات",
    enterFeedback: "أدخل ملاحظاتك...",
    submit: "إرسال",
    
    // Media Buyer
    mediaBuyerDashboard: "لوحة تحكم مشتري الإعلانات",
    approvedQueue: "قائمة الانتظار الموافق عليها",
    campaignCommandCenter: "مركز قيادة الحملة",
    budgetTracking: "تتبع الميزانية",
    cplHealth: "صحة CPL",
    currentSpend: "الإنفاق الحالي",
    budgetLimit: "حد الميزانية",
    cpl: "CPL",
    dailyReport: "التقرير اليومي",
    campaignName: "اسم الحملة",
    statusUpdate: "تحديث الحالة",
    
    // Brief Board
    briefBoard: "لوحة الملخصات",
    createBrief: "إنشاء ملخص",
    briefTitle: "عنوان الملخص",
    assignTo: "تعيين إلى",
    markSeen: "تحديد كمرئي",
    briefSeen: "تم عرض الملخص",
    
    // Activity Log
    globalActivityLog: "سجل النشاط العام",
    action: "الإجراء",
    user: "المستخدم",
    timestamp: "الطابع الزمني",
    details: "التفاصيل",
    
    // Status Messages
    statusChanged: "تم تغيير الحالة",
    uploadedBy: "تم التحميل بواسطة",
    approvedBy: "تمت الموافقة عليه من قبل",
    publishedAt: "تم النشر في",
    
    // Common
    back: "رجوع",
    save: "حفظ",
    delete: "حذف",
    edit: "تحرير",
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
  },
};

export type Language = "en" | "ar";

export function getTranslation(key: keyof typeof translations.en, language: Language = "en"): string {
  return translations[language][key as keyof typeof translations[language]] || key;
}
