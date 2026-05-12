"use client";

import { useState, useRef, FormEvent, ChangeEvent, DragEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, CheckCircle, UploadCloud, GripVertical, ChevronUp, ChevronDown, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const TOTAL_STEPS = 4;

// Predefined company and job title lists
const COMPANIES_LIST = [
  "Apple",
  "Microsoft",
  "Google",
  "Amazon",
  "Meta",
  "Tesla",
  "IBM",
  "Intel",
];

const JOB_TITLES_LIST = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "DevOps Engineer",
  "Business Analyst",
  "QA Engineer",
  "System Architect",
];

interface OrderedItem {
  id: string;
  label: string;
  order: number;
}

export default function RegisterPage() {
  const { lang, t, toggleLang } = useLanguage();

  // --- State ---
  const isRegistrationOpen = true;

  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorType, setErrorType] = useState<"client" | "server">("client");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  // Form data - Step 1: Personal Information
  const [fullNameAr, setFullNameAr] = useState("");
  const [fullNameEn, setFullNameEn] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Form data - Step 2: Academic Information
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [uniId, setUniId] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [linkedin, setLinkedIn] = useState("");

  // Form data - Step 3: Concerns & Preferences
  const [interests, setInterests] = useState("");
  const [skillsProjects, setSkillsProjects] = useState("");
  const [experienceVolunteer, setExperienceVolunteer] = useState("");
  const [freeSpace, setFreeSpace] = useState("");

  // Form data - Step 4: Company & Job Ordering
  const [companiesOrder, setCompaniesOrder] = useState<OrderedItem[]>(
    COMPANIES_LIST.map((company, idx) => ({
      id: `company-${idx}`,
      label: company,
      order: idx + 1,
    }))
  );

  const [jobTitlesOrder, setJobTitlesOrder] = useState<OrderedItem[]>(
    JOB_TITLES_LIST.map((job, idx) => ({
      id: `job-${idx}`,
      label: job,
      order: idx + 1,
    }))
  );

  // Refs for validation
  const formRef = useRef<HTMLFormElement>(null);

  // --- Navigation ---
  const goNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setShowConfirmation(false);
      setCurrentStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setShowConfirmation(false);
      setCurrentStep((s) => s - 1);
    }
  };

  // --- File handling ---
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCvFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  // --- Drag and drop for ordering lists ---
  const handleDragStart = (e: DragEvent<HTMLDivElement>, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropOrder = (
    e: DragEvent<HTMLDivElement>,
    targetId: string,
    listType: "companies" | "jobs"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItemId) return;

    const list = listType === "companies" ? companiesOrder : jobTitlesOrder;
    const draggedIdx = list.findIndex((item) => item.id === draggedItemId);
    const targetIdx = list.findIndex((item) => item.id === targetId);

    if (draggedIdx === -1 || targetIdx === -1 || draggedIdx === targetIdx) return;

    const newList = [...list];
    const [draggedItem] = newList.splice(draggedIdx, 1);
    newList.splice(targetIdx, 0, draggedItem);

    // Reorder numbers
    newList.forEach((item, idx) => {
      item.order = idx + 1;
    });

    if (listType === "companies") {
      setCompaniesOrder(newList);
    } else {
      setJobTitlesOrder(newList);
    }

    setDraggedItemId(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
  };

  // --- Mobile reordering (up/down arrows) ---
  const moveItemUp = (itemId: string, listType: "companies" | "jobs") => {
    const list = listType === "companies" ? companiesOrder : jobTitlesOrder;
    const idx = list.findIndex((item) => item.id === itemId);
    if (idx <= 0) return;

    const newList = [...list];
    [newList[idx], newList[idx - 1]] = [newList[idx - 1], newList[idx]];
    newList.forEach((item, i) => {
      item.order = i + 1;
    });

    if (listType === "companies") {
      setCompaniesOrder(newList);
    } else {
      setJobTitlesOrder(newList);
    }
  };

  const moveItemDown = (itemId: string, listType: "companies" | "jobs") => {
    const list = listType === "companies" ? companiesOrder : jobTitlesOrder;
    const idx = list.findIndex((item) => item.id === itemId);
    if (idx >= list.length - 1) return;

    const newList = [...list];
    [newList[idx], newList[idx + 1]] = [newList[idx + 1], newList[idx]];
    newList.forEach((item, i) => {
      item.order = i + 1;
    });

    if (listType === "companies") {
      setCompaniesOrder(newList);
    } else {
      setJobTitlesOrder(newList);
    }
  };

  // --- Submit ---
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currentStep !== TOTAL_STEPS - 1) return;

    // Client-side validation
    const missingFields: string[] = [];
    
    if (!fullNameEn) missingFields.push(lang === "ar" ? "الاسم بالإنجليزية" : "Name in English");
    if (!fullNameAr) missingFields.push(lang === "ar" ? "الاسم بالعربية" : "Name in Arabic");
    if (!birthDate) missingFields.push(lang === "ar" ? "تاريخ الميلاد" : "Birth Date");
    if (!gender) missingFields.push(lang === "ar" ? "الجنس" : "Gender");
    if (!email) missingFields.push(lang === "ar" ? "البريد الإلكتروني" : "Email");
    if (!phoneNumber) missingFields.push(lang === "ar" ? "رقم الهاتف" : "Phone Number");
    if (!university) missingFields.push(lang === "ar" ? "الجامعة" : "University");
    if (!major) missingFields.push(lang === "ar" ? "التخصص" : "Major");
    if (!uniId) missingFields.push(lang === "ar" ? "رقم الهوية الجامعية" : "University ID");
    if (!graduationYear) missingFields.push(lang === "ar" ? "سنة التخرج" : "Graduation Year");

    if (!cvFile) {
      missingFields.push(lang === "ar" ? "ملف السيرة الذاتية" : "CV File");
    } else {
      // Check CV file size (limit to 10MB)
      const maxSizeMB = 10;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (cvFile.size > maxSizeBytes) {
        setErrorType("client");
        setErrorTitle(lang === "ar" ? "حجم الملف كبير جداً" : "File Size Too Large");
        setErrorMessage(lang === "ar" 
          ? `حجم ملف السيرة الذاتية يجب أن لا يزيد عن ${maxSizeMB}MB` 
          : `CV file size must not exceed ${maxSizeMB}MB`);
        setErrorDetails([lang === "ar" 
          ? `حجم الملف الحالي: ${(cvFile.size / 1024 / 1024).toFixed(2)}MB` 
          : `Current file size: ${(cvFile.size / 1024 / 1024).toFixed(2)}MB`]);
        setShowError(true);
        return;
      }
      
      // Check file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(cvFile.type)) {
        setErrorType("client");
        setErrorTitle(lang === "ar" ? "نوع الملف غير مدعوم" : "Unsupported File Type");
        setErrorMessage(lang === "ar" 
          ? "يرجى استخدام ملفات PDF أو صور (JPG/PNG)" 
          : "Please use PDF or image files (JPG/PNG)");
        setErrorDetails([cvFile.type || "Unknown"]);
        setShowError(true);
        return;
      }
    }

    if (missingFields.length > 0) {
      setErrorType("client");
      setErrorTitle(lang === "ar" ? "حقول مفقودة" : "Missing Required Fields");
      setErrorMessage(lang === "ar" 
        ? "يرجى ملء جميع الحقول المطلوبة:" 
        : "Please fill in all required fields:");
      setErrorDetails(missingFields);
      setShowError(true);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorType("client");
      setErrorTitle(lang === "ar" ? "بريد إلكتروني غير صحيح" : "Invalid Email");
      setErrorMessage(lang === "ar" 
        ? "يرجى إدخال بريد إلكتروني صحيح" 
        : "Please enter a valid email address");
      setErrorDetails([email]);
      setShowError(true);
      return;
    }

    // All validations passed, show confirmation
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);

    try {
      // Serialize ordered lists
      const companiesOrderedString = companiesOrder
        .map((item) => `${item.order}-${item.label}`)
        .join("\n");
      const jobTitlesOrderedString = jobTitlesOrder
        .map((item) => `${item.order}-${item.label}`)
        .join("\n");

      const formData = new FormData();
      // Step 1
      formData.append("name_ar", fullNameAr);
      formData.append("name_en", fullNameEn);
      formData.append("birthdate", birthDate);
      formData.append("gender", gender);
      formData.append("email", email);
      formData.append("phone_number", phoneNumber);
      // Step 2
      formData.append("university", university);
      formData.append("major", major);
      formData.append("uni_id", uniId);
      formData.append("graduation_year", graduationYear);
      formData.append("linkedin", linkedin);
      // Step 3
      formData.append("interests", interests);
      formData.append("skills_projects", skillsProjects);
      formData.append("experience_volunteer", experienceVolunteer);
      formData.append("free_space", freeSpace);
      // Step 4
      formData.append("companies_order", companiesOrderedString);
      formData.append("job_titles_order", jobTitlesOrderedString);
      // CV
      formData.append("cv_file", cvFile!);

      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // Server error - show friendly error dialog
        const errorMsg = result.error || "Failed to submit registration";
        let errorDetail = "";

        // Parse common server errors
        if (errorMsg.includes("email") || errorMsg.toLowerCase().includes("already exists")) {
          setErrorTitle(lang === "ar" ? "البريد الإلكتروني مسجل بالفعل" : "Email Already Registered");
          errorDetail = lang === "ar" 
            ? "هذا البريد الإلكتروني مسجل بالفعل في النظام" 
            : "This email is already registered in the system";
        } else if (errorMsg.includes("database") || errorMsg.includes("server")) {
          setErrorTitle(lang === "ar" ? "خطأ في الخادم" : "Server Error");
          errorDetail = lang === "ar" 
            ? "حدث خطأ في الخادم. يرجى المحاولة لاحقاً" 
            : "A server error occurred. Please try again later";
        } else if (errorMsg.includes("file") || errorMsg.includes("upload")) {
          setErrorTitle(lang === "ar" ? "خطأ في رفع الملف" : "File Upload Error");
          errorDetail = lang === "ar" 
            ? "حدث خطأ أثناء رفع الملف. تأكد من صحة الملف" 
            : "An error occurred while uploading the file. Please check your file";
        } else {
          setErrorTitle(lang === "ar" ? "خطأ في التسجيل" : "Registration Error");
          errorDetail = errorMsg;
        }

        setErrorType("server");
        setErrorMessage(errorDetail);
        setErrorDetails([result.error || "Unknown error"]);
        setShowError(true);
        return;
      }

      if (!result?.success || !result?.registration?.id) {
        setErrorType("server");
        setErrorTitle(lang === "ar" ? "استجابة غير متوقعة" : "Unexpected Response");
        setErrorMessage(lang === "ar" 
          ? "تم التسجيل ولكن لم نتمكن من تأكيد النجاح" 
          : "Registration processed but confirmation failed");
        setErrorDetails([]);
        setShowError(true);
        return;
      }

      // Success
      setShowSuccess(true);
    } catch (error: unknown) {
      console.error("Registration Error:", error);
      
      setErrorType("server");
      setErrorTitle(lang === "ar" ? "خطأ في الاتصال" : "Connection Error");
      setErrorMessage(lang === "ar" 
        ? "حدث خطأ أثناء الاتصال بالخادم. تحقق من اتصالك بالإنترنت" 
        : "A network error occurred. Please check your internet connection");
      
      const devMsg = error instanceof Error ? error.message : JSON.stringify(error);
      setErrorDetails([devMsg]);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Progress ---
  const progressPercent = ((currentStep + 1) / TOTAL_STEPS) * 100;

  // --- Closed View ---
  if (!isRegistrationOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animated-bg" />
        <div className="relative z-10 bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-9 h-9 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{t("regUnavailableTitle")}</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">{t("regUnavailableDesc")}</p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-black transition shadow-md"
          >
            {t("goBackHome")}
          </Link>
        </div>
      </div>
    );
  }

  // --- Success View ---
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animated-bg" />
        <div className="relative z-10 bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{t("regSuccessTitle")}</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">{t("regSuccessDesc")}</p>
          <Link
            href="/"
            className="inline-block bg-brand text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-light transition shadow-md shadow-brand/20"
          >
            {t("regReturnHome")}
          </Link>
        </div>
      </div>
    );
  }

  // --- Confirmation Modal ---
  // --- Error Modal ---
  const ErrorModal = () => (
    <>
      {/* Backdrop */}
      {showError && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setShowError(false)}
        />
      )}

      {/* Modal */}
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all duration-300 animate-modal-in">
            {/* Close Button */}
            <button
              onClick={() => setShowError(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Error Icon & Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                errorType === "client" 
                  ? "bg-amber-50" 
                  : "bg-red-50"
              }`}>
                <svg
                  className={`w-6 h-6 ${
                    errorType === "client" 
                      ? "text-amber-600" 
                      : "text-red-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{errorTitle}</h2>
                <p className={`text-sm font-semibold ${
                  errorType === "client" 
                    ? "text-amber-600" 
                    : "text-red-600"
                }`}>
                  {errorType === "client" 
                    ? (lang === "ar" ? "خطأ من جانبك" : "Your Input Issue") 
                    : (lang === "ar" ? "خطأ في الخادم" : "Server Issue")}
                </p>
              </div>
            </div>

            {/* Main Message */}
            <p className="text-gray-700 mb-4 leading-relaxed">{errorMessage}</p>

            {/* Error Details */}
            {errorDetails.length > 0 && (
              <div className={`mb-6 rounded-2xl p-4 text-sm space-y-2 ${
                errorType === "client" 
                  ? "bg-amber-50/50 border border-amber-100" 
                  : "bg-red-50/50 border border-red-100"
              }`}>
                {errorDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className={`text-lg font-bold mt-0.5 ${
                      errorType === "client" 
                        ? "text-amber-600" 
                        : "text-red-600"
                    }`}>
                      •
                    </span>
                    <span className="text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Help Text */}
            {errorType === "server" && (
              <div className="mb-6 text-xs text-gray-600 bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="font-semibold mb-1">
                  {lang === "ar" ? "ما العمل؟" : "What to do?"}
                </p>
                <p>
                  {lang === "ar" 
                    ? "تحقق من اتصالك بالإنترنت وحاول مرة أخرى. إذا استمرت المشكلة، تواصل معنا." 
                    : "Check your internet connection and try again. If the issue persists, contact support."}
                </p>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowError(false)}
              className="w-full px-4 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-black transition-all duration-200"
            >
              {lang === "ar" ? "فهمت" : "Got it"}
            </button>
          </div>
        </div>
      )}
    </>
  );

  const ConfirmationModal = () => (
    <>
      {/* Backdrop */}
      {showConfirmation && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setShowConfirmation(false)}
        />
      )}

      {/* Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all duration-300 animate-modal-in">
            {/* Close Button */}
            <button
              onClick={() => setShowConfirmation(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">{lang === "ar" ? "تأكيد التسجيل" : "Confirm Registration"}</h2>
            <p className="text-gray-500 text-sm mb-6">{lang === "ar" ? "يرجى التحقق من بيانات التسجيل" : "Please review your registration details"}</p>

            {/* Key Information */}
            <div className="space-y-3 mb-6 bg-gray-50 rounded-2xl p-4">
              <div>
                <p className="text-xs text-gray-500 font-semibold">{lang === "ar" ? "الاسم" : "Name"}</p>
                <p className="text-gray-800 font-semibold">{fullNameEn} {fullNameAr && `(${fullNameAr})`}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</p>
                <p className="text-gray-800 font-semibold break-all">{email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">{lang === "ar" ? "أفضل شركة" : "Top Company"}</p>
                <p className="text-gray-800 font-semibold">{companiesOrder[0]?.label}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">{lang === "ar" ? "أفضل وظيفة" : "Top Job Title"}</p>
                <p className="text-gray-800 font-semibold">{jobTitlesOrder[0]?.label}</p>
              </div>
            </div>

            {/* More Details Toggle */}
            <button
              onClick={() => setExpandedDetails(!expandedDetails)}
              className="w-full flex items-center justify-center gap-2 text-brand hover:text-brand-light font-semibold text-sm mb-6 transition"
            >
              {expandedDetails ? (lang === "ar" ? "إخفاء التفاصيل" : "Hide Details") : (lang === "ar" ? "عرض المزيد" : "More Details")}
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedDetails ? "rotate-180" : ""}`} />
            </button>

            {/* Expanded Details */}
            {expandedDetails && (
              <div className="mb-6 bg-blue-50/50 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-2 text-sm">
                <div><span className="text-gray-600">{lang === "ar" ? "تاريخ الميلاد:" : "Birth Date:"}</span> <span className="text-gray-800 font-semibold">{birthDate}</span></div>
                <div><span className="text-gray-600">{lang === "ar" ? "الجنس:" : "Gender:"}</span> <span className="text-gray-800 font-semibold">{gender}</span></div>
                <div><span className="text-gray-600">{lang === "ar" ? "الجامعة:" : "University:"}</span> <span className="text-gray-800 font-semibold">{university}</span></div>
                <div><span className="text-gray-600">{lang === "ar" ? "التخصص:" : "Major:"}</span> <span className="text-gray-800 font-semibold">{major}</span></div>
                <div><span className="text-gray-600">{lang === "ar" ? "سنة التخرج:" : "Graduation Year:"}</span> <span className="text-gray-800 font-semibold">{graduationYear}</span></div>
                <div><span className="text-gray-600">{lang === "ar" ? "الاهتمامات:" : "Interests:"}</span> <span className="text-gray-800 font-semibold">{interests?.substring(0, 50)}...</span></div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-3 text-gray-600 font-semibold rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleConfirmedSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-brand text-white font-semibold rounded-full hover:bg-brand-light transition-all duration-200 shadow-md shadow-brand/25 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (lang === "ar" ? "جاري الإرسال..." : "Submitting...") : (lang === "ar" ? "تأكيد" : "Confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // --- Form View ---
  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-8 pb-12 relative">
      <div className="animated-bg" />
      <ErrorModal />
      <ConfirmationModal />

      <div className="relative z-10 w-full max-w-[580px]">
        {/* Header */}
        <header className="flex justify-center items-center relative mb-12">
          <Link href="/" className="inline-block z-10 hover:scale-105 transition-transform">
            <Image
              src="/image/khotwa-logo.png"
              alt="Khotwa Logo"
              width={120}
              height={120}
              className="h-28 w-auto object-contain drop-shadow-md"
            />
          </Link>
          <button
            onClick={toggleLang}
            type="button"
            className="absolute start-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-gray-800 hover:text-brand hover:border-brand transition z-10"
          >
            {lang === "ar" ? "English" : "عربي"}
          </button>
        </header>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-8 md:p-10">
          {/* Progress */}
          <div className="mb-8">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full bg-brand rounded-full transition-all duration-500 ease-out ${lang === "ar" ? "float-right" : ""}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
              {t("stepWord")} {currentStep + 1} / {TOTAL_STEPS}
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 0 && (
              <div className="step-card active">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("regNewStep1Title")}</h2>
                <p className="text-gray-500 text-lg mb-8">{t("regNewStep1Desc")}</p>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="fullNameAr" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regFullNameAr")}
                    </label>
                    <input
                      type="text"
                      id="fullNameAr"
                      value={fullNameAr}
                      onChange={(e) => setFullNameAr(e.target.value)}
                      placeholder={t("regFullNameArPlaceholder")}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label htmlFor="fullNameEn" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regFullNameEn")}
                    </label>
                    <input
                      type="text"
                      id="fullNameEn"
                      value={fullNameEn}
                      onChange={(e) => setFullNameEn(e.target.value)}
                      placeholder={t("regFullNameEnPlaceholder")}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regBirthDate")}
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-4">
                      {t("regGender")}
                    </label>
                    <div className="flex gap-8">
                      {[
                        { value: "male", labelKey: "regMale" },
                        { value: "female", labelKey: "regFemale" },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className="flex items-center cursor-pointer text-lg font-medium text-gray-800"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={opt.value}
                            checked={gender === opt.value}
                            onChange={(e) => setGender(e.target.value)}
                            className="absolute opacity-0 cursor-pointer"
                          />
                          <span className="custom-radio" />
                          <span>{t(opt.labelKey)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regEmail")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("regEmailPlaceholder")}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regPhoneNumber")}
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={t("regPhoneNumberPlaceholder")}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Academic Information */}
            {currentStep === 1 && (
              <div className="step-card active">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("regNewStep2Title")}</h2>
                <p className="text-gray-500 text-lg mb-8">{t("regNewStep2Desc")}</p>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="university" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regUniversity")}
                    </label>
                    <input
                      type="text"
                      id="university"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder={t("regUniversityPlaceholder")}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="major" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regMajor")}
                    </label>
                    <input
                      type="text"
                      id="major"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder={t("regMajorPlaceholder")}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="uniId" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regUniId")}
                    </label>
                    <input
                      type="text"
                      id="uniId"
                      value={uniId}
                      onChange={(e) => setUniId(e.target.value)}
                      placeholder={t("regUniIdPlaceholder")}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label htmlFor="graduationYear" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regGraduationYear")}
                    </label>
                    <input
                      type="text"
                      id="graduationYear"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      placeholder={t("regGraduationYearPlaceholder")}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regLinkedIn")}
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedIn(e.target.value)}
                      placeholder={t("regLinkedInPlaceholder")}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Concerns & Preferences */}
            {currentStep === 2 && (
              <div className="step-card active">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("regNewStep3Title")}</h2>
                <p className="text-gray-500 text-lg mb-8">{t("regNewStep3Desc")}</p>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="interests" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regInterests")}
                    </label>
                    <textarea
                      id="interests"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder={t("regInterestsPlaceholder")}
                      rows={3}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="skillsProjects" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regSkillsProjects")}
                    </label>
                    <textarea
                      id="skillsProjects"
                      value={skillsProjects}
                      onChange={(e) => setSkillsProjects(e.target.value)}
                      placeholder={t("regSkillsProjectsPlaceholder")}
                      rows={3}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="experienceVolunteer" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regExperienceVolunteer")}
                    </label>
                    <textarea
                      id="experienceVolunteer"
                      value={experienceVolunteer}
                      onChange={(e) => setExperienceVolunteer(e.target.value)}
                      placeholder={t("regExperienceVolunteerPlaceholder")}
                      rows={3}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="freeSpace" className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("regFreeSpace")}
                    </label>
                    <textarea
                      id="freeSpace"
                      value={freeSpace}
                      onChange={(e) => setFreeSpace(e.target.value)}
                      placeholder={t("regFreeSpacePlaceholder")}
                      rows={3}
                      className="w-full px-4 py-3.5 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition resize-none"
                    />
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      CV Upload
                    </label>
                    <div
                      className={`file-drop-area ${dragOver ? "dragover" : ""}`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <UploadCloud className="w-12 h-12 text-gray-400 mb-4 transition-colors group-hover:text-brand" />
                      <span
                        className={`text-lg font-semibold mb-2 break-all ${
                          cvFile ? "text-brand" : "text-gray-800"
                        }`}
                      >
                        {cvFile ? cvFile.name : t("regFileMsg")}
                      </span>
                      <span className="text-sm text-gray-400">{t("regFileFormat")}</span>
                      <input
                        type="file"
                        accept=".pdf,image/jpeg,image/png"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Company & Job Ordering */}
            {currentStep === 3 && (
              <div className="step-card active">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("regNewStep4Title")}</h2>
                <p className="text-gray-500 text-lg mb-8">{t("regNewStep4Desc")}</p>

                <div className="space-y-8">
                  {/* Companies */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-4">
                      {t("regCompanies")}
                    </label>
                    <p className="text-xs text-gray-500 mb-3 hidden md:block">{t("regDragInstruction")}</p>
                    <p className="text-xs text-gray-500 mb-3 md:hidden">{lang === "ar" ? "استخدم الأزرار للترتيب" : "Use arrows to reorder"}</p>
                    <div className="space-y-2">
                      {companiesOrder.map((company, idx) => (
                        <div
                          key={company.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, company.id)}
                          onDragEnter={handleDragEnter}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropOrder(e, company.id, "companies")}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-50 border-2 border-gray-200 rounded-xl transition-all duration-200 ${
                            draggedItemId === company.id
                              ? "opacity-50 border-brand bg-gradient-to-r from-brand/10 to-brand/5 shadow-md"
                              : "hover:border-brand/50 hover:bg-gradient-to-r hover:from-brand/5 hover:to-brand/5 hover:shadow-sm"
                          }`}
                        >
                          {/* Desktop: Drag Handle */}
                          <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0 hidden md:block" />
                          
                          {/* Order Number */}
                          <span className="font-bold text-lg text-brand min-w-8">{company.order}.</span>
                          
                          {/* Company Name */}
                          <span className="font-semibold text-gray-800 flex-1 text-sm sm:text-base">{company.label}</span>
                          
                          {/* Mobile: Arrow Buttons */}
                          <div className="flex md:hidden gap-1">
                            <button
                              type="button"
                              onClick={() => moveItemUp(company.id, "companies")}
                              disabled={idx === 0}
                              className="p-2 rounded-lg bg-white border border-gray-200 hover:border-brand/50 hover:bg-brand/5 text-gray-600 hover:text-brand transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 duration-150"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItemDown(company.id, "companies")}
                              disabled={idx === companiesOrder.length - 1}
                              className="p-2 rounded-lg bg-white border border-gray-200 hover:border-brand/50 hover:bg-brand/5 text-gray-600 hover:text-brand transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 duration-150"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Job Titles */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-4">
                      {t("regJobTitles")}
                    </label>
                    <p className="text-xs text-gray-500 mb-3 hidden md:block">{t("regDragInstruction")}</p>
                    <p className="text-xs text-gray-500 mb-3 md:hidden">{lang === "ar" ? "استخدم الأزرار للترتيب" : "Use arrows to reorder"}</p>
                    <div className="space-y-2">
                      {jobTitlesOrder.map((job, idx) => (
                        <div
                          key={job.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, job.id)}
                          onDragEnter={handleDragEnter}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropOrder(e, job.id, "jobs")}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-50 border-2 border-gray-200 rounded-xl transition-all duration-200 ${
                            draggedItemId === job.id
                              ? "opacity-50 border-brand bg-gradient-to-r from-brand/10 to-brand/5 shadow-md"
                              : "hover:border-brand/50 hover:bg-gradient-to-r hover:from-brand/5 hover:to-brand/5 hover:shadow-sm"
                          }`}
                        >
                          {/* Desktop: Drag Handle */}
                          <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0 hidden md:block" />
                          
                          {/* Order Number */}
                          <span className="font-bold text-lg text-brand min-w-8">{job.order}.</span>
                          
                          {/* Job Title */}
                          <span className="font-semibold text-gray-800 flex-1 text-sm sm:text-base">{job.label}</span>
                          
                          {/* Mobile: Arrow Buttons */}
                          <div className="flex md:hidden gap-1">
                            <button
                              type="button"
                              onClick={() => moveItemUp(job.id, "jobs")}
                              disabled={idx === 0}
                              className="p-2 rounded-lg bg-white border border-gray-200 hover:border-brand/50 hover:bg-brand/5 text-gray-600 hover:text-brand transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 duration-150"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItemDown(job.id, "jobs")}
                              disabled={idx === jobTitlesOrder.length - 1}
                              className="p-2 rounded-lg bg-white border border-gray-200 hover:border-brand/50 hover:bg-brand/5 text-gray-600 hover:text-brand transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 duration-150"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center mt-10 pt-6 border-t border-gray-100">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={goPrev}
                  className="px-6 py-3 text-base font-semibold rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                >
                  {t("regBtnPrev")}
                </button>
              ) : (
                <div />
              )}

              <div className="flex-1" />

              {currentStep < TOTAL_STEPS - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-8 py-3 text-base font-semibold rounded-full bg-brand text-white hover:bg-brand-light transition shadow-md shadow-brand/25 hover:shadow-lg hover:-translate-y-0.5"
                >
                  {t("regBtnNext")}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !cvFile}
                  className="px-8 py-3 text-base font-semibold rounded-full bg-brand text-white hover:bg-brand-light transition shadow-md shadow-brand/25 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t("regBtnUploading") : t("regBtnSubmit")}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
