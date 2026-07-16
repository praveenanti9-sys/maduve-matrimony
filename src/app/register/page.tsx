"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  Mail, Lock, Eye, EyeOff, User, Phone, Calendar,
  ArrowRight, ArrowLeft, CheckCircle2, UserPlus,
  GraduationCap, Briefcase, MapPin, Heart,
  Users, Ruler, Camera, AlertCircle, Info, FileText,
  Copy, Check, Smartphone, QrCode
} from "lucide-react";

type Gender = "MALE" | "FEMALE" | "";

// Option lists to match ARMember field configurations
const postedByOptions = ["Self", "Sibling", "Parents", "Friend", "Relative"];
const maritalStatusOptions = ["Never Married", "Divorced", "Widowed"];
const bodyTypeOptions = ["Average", "Slim", "Athletic", "Heavy"];
const skinToneOptions = ["Very Fair", "Fair", "Wheatish", "Dark"];
const disabilityOptions = ["None", "Physical Disability"];
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const drinkingOptions = ["Never", "Socially", "Regularly", "Don't Know"];
const smokingOptions = ["Never", "Socially", "Regularly"];

const rashiOptions = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karkataka (Cancer)",
  "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrischika (Scorpio)",
  "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)",
];

const nakshatraOptions = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Moola", "Purva Ashada", "Uttarashada", "Shravana", "Dhanishta",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const ganaOptions = ["Deva", "Manushya", "Rakshasa"];

const educationOptions = [
  "10th Pass", "12th / PUC", "Diploma", "ITI",
  "Graduate (BA/BSc/BCom)", "Engineering (BE/BTech)",
  "Medical (MBBS/BDS)", "Law (LLB/LLM)",
  "Post Graduate (MA/MSc/MBA)", "PhD / Doctorate", "Other",
];

const educationFieldOptions = [
  "Arts", "Science", "Commerce", "Engineering/Technology",
  "Medicine/Healthcare", "Law", "Management/Business",
  "Information Technology", "Agriculture", "Other"
];

const workingWithOptions = [
  "Government / Public Sector", "Private Sector",
  "Business / Self-Employed", "Defense", "Not Working"
];

const incomeOptions = [
  "Below ₹3 Lakhs", "₹3-5 Lakhs", "₹5-8 Lakhs", "₹8-10 Lakhs",
  "₹10-15 Lakhs", "₹15-20 Lakhs", "₹20-30 Lakhs", "₹30-50 Lakhs",
  "₹50 Lakhs+", "Not Disclosed",
];

const familyValueOptions = ["Orthodox", "Traditional", "Moderate", "Liberal"];
const familyTypeOptions = ["Joint Family", "Nuclear Family", "Others"];
const familyStatusOptions = ["Middle", "Upper Middle", "Rich", "Affluent"];
const parentStatusOptions = ["Employed", "Business / Self-Employed", "Retired", "Passed Away"];
const motherStatusOptions = ["Homemaker", "Employed", "Business / Self-Employed", "Retired", "Passed Away"];

const heightOptions = [
  "137cm (4'6\")", "140cm (4'7\")", "142cm (4'8\")", "145cm (4'9\")",
  "147cm (4'10\")", "150cm (4'11\")", "152cm (5'0\")", "155cm (5'1\")",
  "157cm (5'2\")", "160cm (5'3\")", "162cm (5'4\")", "165cm (5'5\")",
  "167cm (5'6\")", "170cm (5'7\")", "172cm (5'8\")", "175cm (5'9\")",
  "177cm (5'10\")", "180cm (5'11\")", "182cm (6'0\")", "185cm (6'1\")",
  "187cm (6'2\")", "191cm (6'3\")"
];

const districtOptions = [
  "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mandya", "Hassan",
  "Tumakuru", "Kolar", "Chikballapur", "Ramanagara", "Chamarajanagar",
  "Dharwad", "Belagavi", "Hubli", "Uttara Kannada", "Dakshina Kannada",
  "Udupi", "Shivamogga", "Haveri", "Gadag", "Davangere", "Chitradurga",
  "Bellary", "Raichur", "Bagalkot", "Vijayapura", "Kalaburagi", "Bidar", "Yadgir",
  "Kodagu", "Chikkamagaluru",
];

interface FieldError { [key: string]: string }

export default function RegisterPage() {
  const router = useRouter();
  const { register, uploadPhoto, error: storeError } = useStore();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Step 1 Form States ──

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<Gender>("");

  // ── Step 2 Form States ──
  const [dob, setDob] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [disability, setDisability] = useState("None");
  const [bloodGroup, setBloodGroup] = useState("");
  const [eatingHabits, setEatingHabits] = useState<string[]>([]);
  const [drinkingHabits, setDrinkingHabits] = useState("");
  const [smokingHabits, setSmokingHabits] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [rashi, setRashi] = useState("");
  const [nakshatra, setNakshatra] = useState("");
  const [gana, setGana] = useState("");
  const [dosham, setDosham] = useState("");

  // ── Step 3 Form States ──
  const [education, setEducation] = useState("");
  const [educationField, setEducationField] = useState("");
  const [college, setCollege] = useState("");
  const [workingWith, setWorkingWith] = useState("");
  const [occupation, setOccupation] = useState("");
  const [organization, setOrganization] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [familyValue, setFamilyValue] = useState("");
  const [familyType, setFamilyType] = useState("");
  const [familyStatus, setFamilyStatus] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [fatherStatus, setFatherStatus] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherStatus, setMotherStatus] = useState("");
  const [brothers, setBrothers] = useState("0");
  const [brothersMarried, setBrothersMarried] = useState("0");
  const [sisters, setSisters] = useState("0");
  const [sistersMarried, setSistersMarried] = useState("0");
  const [familyLocation, setFamilyLocation] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [familyOrigin, setFamilyOrigin] = useState("");

  // ── Step 4 Payment States ──
  const [paymentUtr, setPaymentUtr] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [paymentScreenshotFile, setPaymentScreenshotFile] = useState<File | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const paymentFileInputRef = useRef<HTMLInputElement>(null);

  // ── Step 5 Photo & Consent States ──
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;
  const stepLabels = [
    "Account Details",
    "Lifestyle & Astrology",
    "Career & Family",
    "Activation Payment",
    "Photo & Consent"
  ];

  const upiId = "EZE0436387@CUB";
  const paymentAmount = 1000;
  const upiUri = `upi://pay?pa=${upiId}&pn=Maduvedibbana&am=${paymentAmount}&cu=INR&tn=Reg_${firstName || 'User'}`;

  // ── Handle Clipboard Copy ──
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // ── Handle Photo uploads preview ──
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Please upload a valid image file (JPG, PNG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
      setProfilePhotoFile(file);
      setProfilePhoto(URL.createObjectURL(file));
      const ne = { ...errors };
      delete ne.profilePhoto;
      setErrors(ne);
    }
  };

  // ── Handle Payment Screenshot upload preview ──
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Please upload a valid image file (JPG, PNG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Screenshot must be smaller than 5MB");
        return;
      }
      setPaymentScreenshotFile(file);
      setPaymentScreenshot(URL.createObjectURL(file));
      const ne = { ...errors };
      delete ne.paymentScreenshot;
      setErrors(ne);
    }
  };

  // Password strength meter logic
  const getPasswordStrength = (): number => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    return score;
  };

  const strengthColors = ["#e3e8f0", "#dc2626", "#d97706", "#3b82f6", "#16a34a"];
  const strengthLabels = ["Empty", "Weak", "Fair", "Good", "Strong"];

  // ── Step 1 Validation ──
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldError = {};


    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!postedBy) newErrors.postedBy = "Specify who is creating this profile";

    // Indian 10-digit WhatsApp number validation
    if (!phone) {
      newErrors.phone = "Mobile number is required";
    } else {
      const clean = phone.replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(clean.slice(-10))) {
        newErrors.phone = "Enter a valid 10-digit WhatsApp number";
      }
    }

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (email !== confirmEmail) {
      newErrors.confirmEmail = "Email addresses do not match";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (getPasswordStrength() < 3) {
      newErrors.password = "Password is too weak. Ensure uppercase, number, and special character are included.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!gender) newErrors.gender = "Please select gender";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  // ── Step 2 Validation ──
  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldError = {};

    if (!dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const birth = new Date(dob);
      const age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (gender === 'MALE' && age < 21) newErrors.dob = "Legal marriage age for grooms is 21+";
      if (gender === 'FEMALE' && age < 18) newErrors.dob = "Legal marriage age for brides is 18+";
    }

    if (!maritalStatus) newErrors.maritalStatus = "Marital status is required";
    if (!height) newErrors.height = "Height is required";
    
    if (!weight) {
      newErrors.weight = "Weight is required";
    } else if (isNaN(Number(weight)) || Number(weight) < 30 || Number(weight) > 200) {
      newErrors.weight = "Enter a valid weight in kg (30-200)";
    }

    if (!bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (eatingHabits.length === 0) newErrors.eatingHabits = "Select at least one eating habit";
    if (!rashi) newErrors.rashi = "Raashi is required";
    if (!nakshatra) newErrors.nakshatra = "Nakshathra is required";
    if (!gana) newErrors.gana = "Gana is required";
    if (!dosham) newErrors.dosham = "Specify dosham status";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(3);
  };

  // ── Step 3 Validation ──
  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldError = {};

    if (!education) newErrors.education = "Highest education is required";
    if (!educationField) newErrors.educationField = "Education field is required";
    if (!workingWith) newErrors.workingWith = "Employment sector is required";
    if (!workLocation.trim()) newErrors.workLocation = "Work location/city is required";
    if (!annualIncome) newErrors.annualIncome = "Annual income range is required";

    if (!familyValue) newErrors.familyValue = "Family value type is required";
    if (!familyType) newErrors.familyType = "Family type is required";
    if (!familyStatus) newErrors.familyStatus = "Family status is required";
    if (!fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!fatherStatus) newErrors.fatherStatus = "Father's status is required";
    if (!motherStatus) newErrors.motherStatus = "Mother's status is required";

    if (!brothers || isNaN(Number(brothers))) newErrors.brothers = "Required (use 0 if none)";
    if (!brothersMarried || isNaN(Number(brothersMarried))) newErrors.brothersMarried = "Required (use 0 if none)";
    if (!sisters || isNaN(Number(sisters))) newErrors.sisters = "Required (use 0 if none)";
    if (!sistersMarried || isNaN(Number(sistersMarried))) newErrors.sistersMarried = "Required (use 0 if none)";

    if (!familyLocation.trim()) newErrors.familyLocation = "Family location is required";
    if (!familyOrigin.trim()) newErrors.familyOrigin = "Ancestral origin is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(4);
  };

  // ── Step 4 Validation (Payment) ──
  const handleStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldError = {};

    if (!paymentUtr) {
      newErrors.paymentUtr = "UTR / Transaction Reference Number is required";
    } else if (!/^\d{12}$/.test(paymentUtr)) {
      newErrors.paymentUtr = "UTR must be exactly 12 digits";
    }

    if (!paymentScreenshotFile && !paymentScreenshot) {
      newErrors.paymentScreenshot = "Payment screenshot receipt is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(5);
  };

  // ── Step 5 Submission ──
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldError = {};

    // Profile photo is strictly mandatory (avatar field)
    if (!profilePhotoFile && !profilePhoto) {
      newErrors.profilePhoto = "Profile picture is mandatory to login";
    }

    if (!acceptTerms) {
      newErrors.acceptTerms = "You must accept the Terms & Conditions and Privacy Policy";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      let finalPhotoUrl = "";
      if (profilePhotoFile) {
        const url = await uploadPhoto(profilePhotoFile);
        if (!url) {
          throw new Error("Failed to upload profile photo. Please try again.");
        }
        finalPhotoUrl = url;
      }

      let finalScreenshotUrl = "";
      if (paymentScreenshotFile) {
        const tempFolder = 'pay_' + (Math.random().toString(36).substring(2, 8));
        const url = await uploadPhoto(paymentScreenshotFile, tempFolder);
        if (!url) {
          throw new Error("Failed to upload payment screenshot. Please try again.");
        }
        finalScreenshotUrl = url;
      }

      // Prepare payload to register endpoint mapped to ARMember field names
      const payload = {
        email: email,
        password: password,

        text_6lo7p: firstName,
        text_uuxfr: lastName,
        select_y9qog: postedBy,
        text_vlenr: phone,
        gender: gender,
        date_ucelp: dob,
        radio_6yahf: maritalStatus,
        select_vbkvr: height,
        text_ckkxj: weight,
        radio_cm5s8: bodyType,
        radio_5pnjy: skinTone,
        radio_w3rke: disability,
        select_lehdo: bloodGroup,
        checkbox_rjekv: eatingHabits,
        select_rv5zv: drinkingHabits,
        select_z7uro: smokingHabits,
        birth_time: birthTime,
        text_pivyw: birthPlace,
        select_jeakk: rashi,
        select_vjmu2: nakshatra,
        select_qeo3m: gana,
        radio_so79q: dosham,
        select_3fxzr: education,
        select_xtyxy: educationField,
        text_b1gvp: college,
        select_giore: workingWith,
        select_yr1hd: occupation,
        text_w7iyw: organization,
        text_3a4em: workLocation,
        select_3iunu: annualIncome,
        radio_xdzu9: familyValue,
        radio_tyzfs: familyType,
        radio_4pzno: familyStatus,
        text_4obie: fatherName,
        select_tmkwh: fatherStatus,
        text_fxamj: motherName,
        select_3dm9u: motherStatus,
        text_yaxmk: brothers,
        text_qswpw: brothersMarried,
        text_pqeee: sisters,
        text_3qceb: sistersMarried,
        text_wjnit: familyLocation,
        text_t6hil: guardianPhone,
        text_fqhn4: familyOrigin,
        textarea_d8efs: bio,
        profile_photo: finalPhotoUrl,
        
        // Payment info payload mapping
        payment_status: 'pending_verification',
        payment_utr: paymentUtr,
        payment_screenshot: finalScreenshotUrl,
        payment_amount: paymentAmount,
      };

      const success = await register(payload);
      if (success) {
        setShowSuccessModal(true);
      } else {
        setErrors({ submit: storeError || "Registration failed. Try a different username/email." });
      }
    } catch (err) {
      setErrors({ submit: (err as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", background: "#fafcff",
    border: "1px solid #e3e8f0", borderRadius: "12px",
    fontSize: "14px", color: "#1e2a44", outline: "none", minHeight: "46px",
    cursor: "pointer", appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
  };

  const ErrorMsg = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return (
      <span style={{ fontSize: "11px", color: "#dc2626", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", fontWeight: 500 }}>
        <AlertCircle style={{ width: "12px", height: "12px" }} /> {errors[field]}
      </span>
    );
  };

  return (
    <section style={{ maxWidth: "680px", margin: "40px auto 80px", padding: "0 20px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #1e2a44, #c6a55c)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <UserPlus style={{ width: "26px", height: "26px", color: "#fff" }} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, color: "#1e2a44", marginBottom: "6px" }}>
            Register Profile
          </h1>
          <p style={{ fontSize: "13px", color: "#5f6368" }}>Join the Okkaliga Community Matrimony platform</p>
        </div>

        {/* Step Indicator */}
        <div style={{ position: "relative", marginBottom: "12px", padding: "0 10px" }}>
          {/* Background connecting line stretching across all steps */}
          <div style={{
            position: "absolute",
            top: "18px",
            left: "20px",
            right: "20px",
            height: "2px",
            background: "#e3e8f0",
            zIndex: 0
          }} />
          
          {/* Active connecting line showing progress */}
          <div style={{
            position: "absolute",
            top: "18px",
            left: "20px",
            width: `${((step - 1) / (totalSteps - 1)) * 100}%`,
            height: "2px",
            background: "#16a34a",
            zIndex: 0,
            transition: "width 0.3s ease"
          }} />

          {/* Step Nodes container */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 700,
                  background: step > s ? "#16a34a" : step === s ? "#1e2a44" : "#fff",
                  color: step >= s ? "#fff" : "#5f6368",
                  border: step >= s ? "none" : "2px solid #e3e8f0",
                  transition: "all 0.3s ease",
                  boxShadow: step === s ? "0 4px 10px rgba(30,42,68,0.25)" : "none"
                }}>
                  {step > s ? <CheckCircle2 style={{ width: "18px", height: "18px" }} /> : s}
                </div>
                <span style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: step >= s ? "#1e2a44" : "#a0aec0",
                  marginTop: "6px",
                  whiteSpace: "nowrap"
                }} className="hidden md:block">
                  {stepLabels[s - 1]}
                </span>
              </div>
            ))}
          </div>

          {/* Current Step Label for Mobile */}
          <div style={{ textAlign: "center", marginTop: "16px" }} className="block md:hidden">
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#c6a55c",
              textTransform: "uppercase" as const,
              letterSpacing: "0.5px"
            }}>
              Step {step} of {totalSteps}
            </span>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44", margin: "2px 0 0" }}>
              {stepLabels[step - 1]}
            </h4>
          </div>
        </div>

        <div className="card" style={{ padding: "32px" }}>
          
          {/* STEP 1: ACCOUNT & CONTACT INFO */}
          {step === 1 && (
            <form onSubmit={handleStep1} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f0ece4", paddingBottom: "8px", marginBottom: "4px" }}>
                <Info style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>Account Credentials</h3>
              </div>

              <div style={{
                background: "rgba(198, 165, 92, 0.08)",
                border: "1px dashed rgba(198, 165, 92, 0.4)",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}>
                <Info style={{ width: "18px", height: "18px", color: "#c6a55c", marginTop: "2px", flexShrink: 0 }} />
                <p style={{ fontSize: "12px", color: "#5f6368", margin: 0, lineHeight: "1.5" }}>
                  <strong style={{ color: "#1e2a44" }}>One-Time Activation Fee:</strong> A fee of <strong>₹1,000</strong> will be charged in Step 4 to verify and activate your matrimony profile.
                </p>
              </div>


              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>First Name *</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" placeholder="First Name" />
                  <ErrorMsg field="firstName" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Last Name *</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input" placeholder="Last Name" />
                  <ErrorMsg field="lastName" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Posted By *</label>
                  <select value={postedBy} onChange={(e) => setPostedBy(e.target.value)} style={selectStyle}>
                    <option value="">Select Option</option>
                    {postedByOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="postedBy" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>WhatsApp Mobile No (Confidential) *</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="WhatsApp mobile number" />
                  <ErrorMsg field="phone" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Email Address (Confidential) *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
                  <ErrorMsg field="email" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Confirm Email Address *</label>
                  <input type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} className="input" placeholder="Re-type email address" />
                  <ErrorMsg field="confirmEmail" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Password *</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="input" style={{ paddingRight: "44px" }} placeholder="Strength: uppercase + digit + special" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a0aec0" }}>
                      {showPassword ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
                    </button>
                  </div>
                  <ErrorMsg field="password" />
                  {password && (
                    <div style={{ marginTop: "6px" }}>
                      <div style={{ display: "flex", gap: "4px", marginBottom: "2px" }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: getPasswordStrength() >= i ? strengthColors[getPasswordStrength()] : "#e3e8f0" }} />
                        ))}
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: strengthColors[getPasswordStrength()] }}>{strengthLabels[getPasswordStrength()]} password</span>
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Confirm Password *</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" placeholder="Confirm password" />
                  <ErrorMsg field="confirmPassword" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Gender *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  {(["MALE", "FEMALE"] as const).map((g) => (
                    <button key={g} type="button" onClick={() => setGender(g)} style={{
                      padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                      border: gender === g ? "2px solid #1e2a44" : "1px solid #e3e8f0",
                      background: gender === g ? "rgba(30,42,68,0.04)" : "#fff",
                      color: gender === g ? "#1e2a44" : "#5f6368",
                      transition: "all 0.2s ease",
                    }}>
                      {g === "MALE" ? "👨 Male (Groom)" : "👩 Female (Bride)"}
                    </button>
                  ))}
                </div>
                <ErrorMsg field="gender" />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", minHeight: "48px", marginTop: "10px" }}>
                <span>Continue to Step 2</span> <ArrowRight style={{ width: "16px", height: "16px" }} />
              </button>
            </form>
          )}

          {/* STEP 2: BASICS, LIFESTYLE & ASTROLOGY */}
          {step === 2 && (
            <form onSubmit={handleStep2} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f0ece4", paddingBottom: "8px", marginBottom: "4px" }}>
                <Ruler style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>Basics & Lifestyle</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Date of Birth *</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="input" />
                  <ErrorMsg field="dob" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Marital Status *</label>
                  <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} style={selectStyle}>
                    <option value="">Select Status</option>
                    {maritalStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="maritalStatus" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Height *</label>
                  <select value={height} onChange={(e) => setHeight(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {heightOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="height" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Body Weight (KG) *</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="input" placeholder="e.g. 60" />
                  <ErrorMsg field="weight" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Blood Group *</label>
                  <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {bloodGroupOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="bloodGroup" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Body Type</label>
                  <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {bodyTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Skin Tone</label>
                  <select value={skinTone} onChange={(e) => setSkinTone(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {skinToneOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Disability *</label>
                  <select value={disability} onChange={(e) => setDisability(e.target.value)} style={selectStyle}>
                    {disabilityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="disability" />
                </div>
              </div>

              <div style={{ background: "#fafcff", padding: "16px", borderRadius: "12px", border: "1px solid #e3e8f0" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "8px" }}>Eating Habits *</label>
                <div style={{ display: "flex", gap: "20px" }}>
                  {["Non Vegetarian", "Vegetarian", "Eggetarian"].map((habit) => (
                    <label key={habit} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#5f6368", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={eatingHabits.includes(habit)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...eatingHabits, habit]
                            : eatingHabits.filter(h => h !== habit);
                          setEatingHabits(updated);
                          if (errors.eatingHabits && updated.length > 0) {
                            const ne = { ...errors };
                            delete ne.eatingHabits;
                            setErrors(ne);
                          }
                        }}
                        style={{ width: "16px", height: "16px", accentColor: "#1e2a44" }}
                      />
                      {habit}
                    </label>
                  ))}
                </div>
                <ErrorMsg field="eatingHabits" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Drinking Habits</label>
                  <select value={drinkingHabits} onChange={(e) => setDrinkingHabits(e.target.value)} style={selectStyle}>
                    <option value="">Select Option</option>
                    {drinkingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Smoking Habits</label>
                  <select value={smokingHabits} onChange={(e) => setSmokingHabits(e.target.value)} style={selectStyle}>
                    <option value="">Select Option</option>
                    {smokingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f0ece4", paddingBottom: "8px", marginTop: "10px", marginBottom: "4px" }}>
                <Heart style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>Astrology & Birth Details</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Birth Time (AM/PM)</label>
                  <input type="text" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} className="input" placeholder="e.g. 10:45 AM" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Place of Birth</label>
                  <input type="text" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} className="input" placeholder="e.g. Bengaluru" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Raashi (Zodiac) *</label>
                  <select value={rashi} onChange={(e) => setRashi(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {rashiOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="rashi" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Nakshathra (Star) *</label>
                  <select value={nakshatra} onChange={(e) => setNakshatra(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {nakshatraOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="nakshatra" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Gana *</label>
                  <select value={gana} onChange={(e) => setGana(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {ganaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="gana" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Dosham *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  {["No", "Yes"].map((val) => (
                    <button key={val} type="button" onClick={() => setDosham(val)} style={{
                      padding: "10px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                      border: dosham === val ? "2px solid #1e2a44" : "1px solid #e3e8f0",
                      background: dosham === val ? "rgba(30,42,68,0.04)" : "#fff",
                      color: dosham === val ? "#1e2a44" : "#5f6368",
                      transition: "all 0.2s ease",
                    }}>
                      {val}
                    </button>
                  ))}
                </div>
                <ErrorMsg field="dosham" />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button type="button" onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, minHeight: "48px" }}>
                  <ArrowLeft style={{ width: "16px", height: "16px" }} /> <span>Back</span>
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2, minHeight: "48px" }}>
                  <span>Continue to Step 3</span> <ArrowRight style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: EDUCATION, CAREER & FAMILY */}
          {step === 3 && (
            <form onSubmit={handleStep3} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f0ece4", paddingBottom: "8px", marginBottom: "4px" }}>
                <GraduationCap style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>Education & Career</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Highest Education *</label>
                  <select value={education} onChange={(e) => setEducation(e.target.value)} style={selectStyle}>
                    <option value="">Select Education</option>
                    {educationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="education" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Education in (field) *</label>
                  <select value={educationField} onChange={(e) => setEducationField(e.target.value)} style={selectStyle}>
                    <option value="">Select Field</option>
                    {educationFieldOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="educationField" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>College / University Attended</label>
                <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} className="input" placeholder="e.g. Bangalore University" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Working With *</label>
                  <select value={workingWith} onChange={(e) => setWorkingWith(e.target.value)} style={selectStyle}>
                    <option value="">Select Employment</option>
                    {workingWithOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="workingWith" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Working As (Designation)</label>
                  <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} className="input" placeholder="e.g. Project Manager" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Organization</label>
                  <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="input" placeholder="e.g. Infosys" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Work Location *</label>
                  <input type="text" value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} className="input" placeholder="e.g. Bengaluru" />
                  <ErrorMsg field="workLocation" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Annual Income *</label>
                <select value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} style={selectStyle}>
                  <option value="">Select Income Range</option>
                  {incomeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ErrorMsg field="annualIncome" />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f0ece4", paddingBottom: "8px", marginTop: "10px", marginBottom: "4px" }}>
                <Users style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>Family Specifications</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Family Value *</label>
                  <select value={familyValue} onChange={(e) => setFamilyValue(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {familyValueOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="familyValue" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Family Type *</label>
                  <select value={familyType} onChange={(e) => setFamilyType(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {familyTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="familyType" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Family Status *</label>
                  <select value={familyStatus} onChange={(e) => setFamilyStatus(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {familyStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="familyStatus" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Father&apos;s Name *</label>
                  <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="input" placeholder="Father's full name" />
                  <ErrorMsg field="fatherName" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Father&apos;s Status *</label>
                  <select value={fatherStatus} onChange={(e) => setFatherStatus(e.target.value)} style={selectStyle}>
                    <option value="">Select Status</option>
                    {parentStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="fatherStatus" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Mother&apos;s Name</label>
                  <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} className="input" placeholder="Mother's full name" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Mother&apos;s Status *</label>
                  <select value={motherStatus} onChange={(e) => setMotherStatus(e.target.value)} style={selectStyle}>
                    <option value="">Select Status</option>
                    {motherStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ErrorMsg field="motherStatus" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Brothers *</label>
                  <input type="number" value={brothers} onChange={(e) => setBrothers(e.target.value)} className="input" min={0} />
                  <ErrorMsg field="brothers" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Brothers Married *</label>
                  <input type="number" value={brothersMarried} onChange={(e) => setBrothersMarried(e.target.value)} className="input" min={0} />
                  <ErrorMsg field="brothersMarried" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Sisters *</label>
                  <input type="number" value={sisters} onChange={(e) => setSisters(e.target.value)} className="input" min={0} />
                  <ErrorMsg field="sisters" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#5f6368", marginBottom: "6px" }}>Sisters Married *</label>
                  <input type="number" value={sistersMarried} onChange={(e) => setSistersMarried(e.target.value)} className="input" min={0} />
                  <ErrorMsg field="sistersMarried" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Family Location *</label>
                  <input type="text" value={familyLocation} onChange={(e) => setFamilyLocation(e.target.value)} className="input" placeholder="e.g. Mandya" />
                  <ErrorMsg field="familyLocation" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Ancestral/Family Origin *</label>
                  <input type="text" value={familyOrigin} onChange={(e) => setFamilyOrigin(e.target.value)} className="input" placeholder="e.g. Hassan" />
                  <ErrorMsg field="familyOrigin" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Parents/Guardian Contact No.</label>
                <input type="tel" value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} className="input" placeholder="Will be kept confidential" />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button type="button" onClick={() => setStep(2)} className="btn-outline" style={{ flex: 1, minHeight: "48px" }}>
                  <ArrowLeft style={{ width: "16px", height: "16px" }} /> <span>Back</span>
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2, minHeight: "48px" }}>
                  <span>Continue to Step 4</span> <ArrowRight style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: ACTIVATION PAYMENT (₹1,000) */}
          {step === 4 && (
            <form onSubmit={handleStep4} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f0ece4", paddingBottom: "8px", marginBottom: "4px" }}>
                <QrCode style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>Okkaliga Community Activation Payment</h3>
              </div>

              {/* Gold Glassmorphic QR Box */}
              <div style={{
                background: "linear-gradient(135deg, rgba(30,42,68,0.95), rgba(42,54,115,0.9))",
                padding: "24px 16px", borderRadius: "16px", color: "#fff", textAlign: "center",
                boxShadow: "0 8px 32px rgba(30, 42, 68, 0.15)", border: "1px solid rgba(198,165,92,0.3)"
              }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#c6a55c", textTransform: "uppercase", letterSpacing: "1px" }}>Profile Activation Fee</span>
                <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "6px 0 16px", fontFamily: "Outfit, sans-serif" }}>₹1,000</h2>
                
                {/* QR Code Container */}
                <div style={{
                  width: "240px", height: "240px", background: "#fff", padding: "10px",
                  borderRadius: "12px", margin: "0 auto 16px", display: "flex", alignItems: "center",
                  justifyContent: "center", border: "4px solid #c6a55c"
                }}>
                  <img src="/payment_qr.jpg" alt="UPI Payment QR Code" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>

                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: "0 0 12px", lineHeight: "1.4" }}>
                  Scan the QR code with any UPI app (GPay, PhonePe, Paytm, BHIM) to pay the one-time verification fee.
                </p>

                {/* UPI copy layout */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(255,255,255,0.06)", padding: "8px 12px", borderRadius: "8px", maxWidth: "260px", margin: "0 auto" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", letterSpacing: "0.5px" }}>UPI ID: <strong>{upiId}</strong></span>
                  <button type="button" onClick={copyUpiId} style={{ background: "none", border: "none", cursor: "pointer", color: copiedNotification ? "#16a34a" : "#c6a55c", display: "flex", alignItems: "center" }}>
                    {copiedNotification ? <Check style={{ width: "14px", height: "14px" }} /> : <Copy style={{ width: "14px", height: "14px" }} />}
                  </button>
                </div>
                {copiedNotification && <span style={{ fontSize: "10px", color: "#16a34a", fontWeight: 600, display: "block", marginTop: "4px" }}>Copied UPI ID!</span>}
              </div>

              {/* Mobile Deep Linking Brand Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#5f6368", textAlign: "center" }}>Paying from mobile? Tap to open payment app:</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <a href={upiUri} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    background: "linear-gradient(135deg, #1a73e8, #1557b0)", color: "#fff",
                    textDecoration: "none", minHeight: "46px", borderRadius: "12px", fontSize: "13px", fontWeight: 700
                  }}>
                    <Smartphone style={{ width: "16px", height: "16px" }} /> Google Pay / UPI
                  </a>
                  <a href={upiUri} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    background: "linear-gradient(135deg, #5f259f, #4d1c82)", color: "#fff",
                    textDecoration: "none", minHeight: "46px", borderRadius: "12px", fontSize: "13px", fontWeight: 700
                  }}>
                    <Smartphone style={{ width: "16px", height: "16px" }} /> PhonePe / BHIM
                  </a>
                </div>
              </div>

              {/* UTR Input Form */}
              <div style={{ background: "#fafcff", padding: "16px", borderRadius: "12px", border: "1px solid #e3e8f0", marginTop: "4px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>12-Digit Transaction Reference (UTR) *</label>
                <input
                  type="text"
                  value={paymentUtr}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                    setPaymentUtr(val);
                    if (errors.paymentUtr) {
                      const ne = { ...errors };
                      delete ne.paymentUtr;
                      setErrors(ne);
                    }
                  }}
                  className="input"
                  placeholder="Enter 12-digit transaction number"
                />
                <ErrorMsg field="paymentUtr" />
                <span style={{ fontSize: "10px", color: "#a0aec0", display: "block", marginTop: "4px" }}>
                  Found under transaction details in your payment app receipt (e.g. UPI Ref No, UTR).
                </span>
              </div>

              {/* Drag & Drop Screenshot proof */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Upload Payment Screenshot Proof *</label>
                <input
                  type="file"
                  ref={paymentFileInputRef}
                  onChange={handleScreenshotUpload}
                  accept="image/png, image/jpeg, image/jpg"
                  style={{ display: "none" }}
                />
                <div
                  onClick={() => paymentFileInputRef.current?.click()}
                  style={{
                    height: "140px", borderRadius: "12px", border: paymentScreenshot ? "2px solid #16a34a" : "2px dashed #d4d8e0",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", backgroundImage: paymentScreenshot ? `url('${paymentScreenshot}')` : "none",
                    backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                    background: paymentScreenshot ? undefined : "rgba(30,42,68,0.01)", position: "relative",
                    transition: "all 0.2s ease"
                  }}
                >
                  {!paymentScreenshot ? (
                    <>
                      <Camera style={{ width: "20px", height: "20px", color: "#c6a55c", marginBottom: "6px" }} />
                      <span style={{ fontSize: "12px", color: "#5f6368", fontWeight: 500 }}>Upload Receipt Screenshot</span>
                      <span style={{ fontSize: "10px", color: "#a0aec0", marginTop: "2px" }}>PNG, JPG (Max 5MB)</span>
                    </>
                  ) : (
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "rgba(0,0,0,0.6)", padding: "6px",
                      borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px",
                      textAlign: "center", fontSize: "10px", color: "#fff", fontWeight: 600
                    }}>
                      Change Payment Proof Image
                    </div>
                  )}
                </div>
                <ErrorMsg field="paymentScreenshot" />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button type="button" onClick={() => setStep(3)} className="btn-outline" style={{ flex: 1, minHeight: "48px" }}>
                  <ArrowLeft style={{ width: "16px", height: "16px" }} /> <span>Back</span>
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2, minHeight: "48px" }}>
                  <span>Continue to Step 5</span> <ArrowRight style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: PHOTO & CONSENT */}
          {step === 5 && (
            <form onSubmit={handleFinalSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f0ece4", paddingBottom: "8px", marginBottom: "4px" }}>
                <Camera style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>Profile Verification Picture</h3>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/png, image/jpeg, image/jpg"
                style={{ display: "none" }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  height: "220px", borderRadius: "16px", border: profilePhoto ? "2px solid #16a34a" : "2px dashed #d4d8e0",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", backgroundImage: profilePhoto ? `url('${profilePhoto}')` : "none",
                  backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                  background: profilePhoto ? undefined : "rgba(30,42,68,0.02)", position: "relative",
                  transition: "all 0.3s ease",
                }}
              >
                {!profilePhoto ? (
                  <>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(198,165,92,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                      <Camera style={{ width: "24px", height: "24px", color: "#c6a55c" }} />
                    </div>
                    <span style={{ fontSize: "14px", color: "#1e2a44", fontWeight: 600 }}>Upload Profile Picture *</span>
                    <span style={{ fontSize: "11px", color: "#a0aec0", marginTop: "4px" }}>Mandatory to create and log in to your account (Max 5MB)</span>
                  </>
                ) : (
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    background: "rgba(0,0,0,0.6)", padding: "10px",
                    borderBottomLeftRadius: "14px", borderBottomRightRadius: "14px",
                    textAlign: "center", fontSize: "12px", color: "#fff", fontWeight: 600
                  }}>
                    Change Profile Photo
                  </div>
                )}
              </div>
              <ErrorMsg field="profilePhoto" />

              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f0ece4", paddingBottom: "8px", marginTop: "10px", marginBottom: "4px" }}>
                <FileText style={{ width: "16px", height: "16px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1e2a44" }}>About & Consent</h3>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>About Me & My Family</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 500))}
                  className="input"
                  style={{ minHeight: "100px", resize: "none", height: "auto", padding: "12px" }}
                  placeholder="Share a brief overview of yourself, your hobbies, family background, and partner preferences..."
                />
                <span style={{ display: "block", fontSize: "10px", color: "#a0aec0", textAlign: "right", marginTop: "4px" }}>
                  {bio.length}/500 characters
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px", background: "#fafcff", border: "1px solid #e3e8f0", borderRadius: "12px" }}>
                <input
                  type="checkbox"
                  id="consent_check"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={{ width: "18px", height: "18px", marginTop: "2px", accentColor: "#1e2a44", cursor: "pointer" }}
                />
                <label htmlFor="consent_check" style={{ fontSize: "12px", color: "#5f6368", lineHeight: 1.5, cursor: "pointer" }}>
                  I confirm that all information provided is accurate. I accept the <Link href="/terms" target="_blank" style={{ color: "#c6a55c", fontWeight: 600, textDecoration: "none" }}>Terms and Conditions</Link> and <Link href="/privacy-policy" target="_blank" style={{ color: "#c6a55c", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</Link> of Maduvedibbana Matrimony. *
                </label>
              </div>
              <ErrorMsg field="acceptTerms" />

              {errors.submit && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: "10px", color: "#dc2626", fontSize: "12px", fontWeight: 500 }}>
                  <AlertCircle style={{ width: "16px", height: "16px", flexShrink: 0 }} />
                  {errors.submit}
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button type="button" onClick={() => setStep(4)} className="btn-outline" style={{ flex: 1, minHeight: "48px" }}>
                  <ArrowLeft style={{ width: "16px", height: "16px" }} /> <span>Back</span>
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary-gold" style={{ flex: 2, minHeight: "48px", opacity: isSubmitting ? 0.7 : 1 }}>
                  <span>{isSubmitting ? "Submitting..." : "Submit Registration"}</span> <CheckCircle2 style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            </form>
          )}

          <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #f0ece4" }}>
            <p style={{ fontSize: "13px", color: "#5f6368", margin: 0 }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#c6a55c", fontWeight: 700, textDecoration: "none" }}>Log In</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ width: "100%", maxWidth: "440px", background: "#fff", borderRadius: "20px", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "scaleIn 0.3s ease", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle2 style={{ width: "32px", height: "32px", color: "#16a34a" }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "24px", color: "#1e2a44", marginBottom: "12px" }}>
              Registered Successfully!
            </h3>
            <p style={{ fontSize: "14px", color: "#5f6368", lineHeight: 1.6, marginBottom: "24px" }}>
              Your profile registration and payment details have been submitted. Maduvedibbana admin will verify your payment UTR and activate your profile within 2-4 days. You will receive an email confirmation once verified and activated.
            </p>
            <button 
              onClick={() => router.push("/login")}
              className="btn-primary"
              style={{ width: "100%", minHeight: "48px" }}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
