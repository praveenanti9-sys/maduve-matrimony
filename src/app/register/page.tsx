"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  Mail, Lock, Eye, EyeOff, User, Phone, Calendar,
  ArrowRight, ArrowLeft, CheckCircle2, UserPlus,
  GraduationCap, Briefcase, MapPin, Heart,
  Users, Ruler, Camera, AlertCircle,
} from "lucide-react";

type Gender = "MALE" | "FEMALE" | "";

const educationOptions = [
  "10th Pass", "12th / PUC", "Diploma", "ITI",
  "Graduate (BA/BSc/BCom)", "Engineering (BE/BTech)",
  "Medical (MBBS/BDS)", "Law (LLB/LLM)",
  "Post Graduate (MA/MSc/MBA)", "PhD / Doctorate", "Other",
];

const maritalStatusOptions = ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"];

const complexionOptions = ["Very Fair", "Fair", "Wheatish", "Wheatish Medium", "Dark"];

const nakshatraOptions = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Moola", "Purva Ashada", "Uttarashada", "Shravana", "Dhanishta",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const rashiOptions = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karkataka (Cancer)",
  "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrischika (Scorpio)",
  "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)",
];

const incomeOptions = [
  "Below ₹3 Lakhs", "₹3-5 Lakhs", "₹5-8 Lakhs", "₹8-10 Lakhs",
  "₹10-15 Lakhs", "₹15-20 Lakhs", "₹20-30 Lakhs", "₹30-50 Lakhs",
  "₹50 Lakhs+", "Not Disclosed",
];

const districtOptions = [
  "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mandya", "Hassan",
  "Tumakuru", "Kolar", "Chikballapur", "Ramanagara", "Chamarajanagar",
  "Dharwad", "Belagavi", "Hubli", "Uttara Kannada", "Dakshina Kannada",
  "Udupi", "Shivamogga", "Haveri", "Gadag", "Davangere", "Chitradurga",
  "Bellary", "Raichur", "Bagalkot", "Vijayapura", "Kalaburagi", "Bidar", "Yadgir",
  "Kodagu", "Chikkamagaluru",
];

const heightOptions = ["4'6\"","4'7\"","4'8\"","4'9\"","4'10\"","4'11\"","5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\"","6'4\"","6'5\""];

// ── Validation helpers ──
const validateName = (name: string): string => {
  if (!name.trim()) return "Full name is required";
  if (name.trim().length < 3) return "Name must be at least 3 characters";
  if (!/^[a-zA-Z\s.]+$/.test(name.trim())) return "Name can only contain letters, spaces, and dots";
  return "";
};

const validateEmail = (email: string): string => {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
  if (email.trim().toLowerCase() === "admin@maduvedibbana.com") return "This email address is reserved and cannot be used.";
  return "";
};

const validatePhone = (phone: string): string => {
  if (!phone.trim()) return "Phone number is required";
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Only strip country code '91' if the number has 12 digits total
  // Only strip leading '0' if the number has 11 digits total
  let digits = cleaned;
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    digits = cleaned.substring(2);
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    digits = cleaned.substring(1);
  }

  if (!/^[6-9]\d{9}$/.test(digits)) return "Enter a valid 10-digit Indian mobile number";
  return "";
};

const validatePassword = (password: string): string => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Include at least 1 uppercase letter";
  if (!/[0-9]/.test(password)) return "Include at least 1 number";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Include at least 1 special character";
  return "";
};

const validateDob = (dob: string, gender: string): string => {
  if (!dob) return "Date of birth is required";
  const birth = new Date(dob);
  const now = new Date();
  const age = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  
  if (gender === 'MALE' && age < 21) return "Legal marriage age for men is 21+";
  if (gender === 'FEMALE' && age < 18) return "Legal marriage age for women is 18+";
  if (!gender && age < 18) return "You must be at least 18 years old";
  
  if (age > 60) return "Age must be below 60 years";
  return "";
};

const validatePrefAge = (min: string, max: string): string => {
  if (min && max) {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);
    if (minVal > maxVal) return "Min age cannot be greater than max age";
    if (minVal < 18 || maxVal > 60) return "Age range must be between 18-60";
  }
  return "";
};

interface FieldError { [key: string]: string }

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useStore();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Step 1 — Basic Info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [dob, setDob] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [acceptTerms, setAcceptTerms] = useState(false);

  // Step 2 — Personal Details
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [complexion, setComplexion] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [nativePlace, setNativePlace] = useState("");

  // Step 3 — Religion, Family, Bio
  const [gothra, setGothra] = useState("");
  const [nakshatra, setNakshatra] = useState("");
  const [rashi, setRashi] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [siblings, setSiblings] = useState("");
  const [bio, setBio] = useState("");

  // Partner Preferences
  const [prefAgeMin, setPrefAgeMin] = useState("");
  const [prefAgeMax, setPrefAgeMax] = useState("");
  const [prefHeightMin, setPrefHeightMin] = useState("");
  const [prefDistrict, setPrefDistrict] = useState("");
  const [prefEducation, setPrefEducation] = useState("");

  // Password strength
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    return score;
  };
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "#dc2626", "#d97706", "#3b82f6", "#16a34a"];

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldError = {};
    const nameErr = validateName(fullName);
    if (nameErr) newErrors.fullName = nameErr;
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;
    const phoneErr = validatePhone(phone);
    if (phoneErr) newErrors.phone = phoneErr;
    const pwErr = validatePassword(password);
    if (pwErr) newErrors.password = pwErr;
    const dobErr = validateDob(dob, gender);
    if (dobErr) newErrors.dob = dobErr;
    if (!gender) newErrors.gender = "Please select your gender";
    if (!acceptTerms) newErrors.terms = "You must accept the terms";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldError = {};
    if (!maritalStatus) newErrors.maritalStatus = "Marital status is required";
    if (!education) newErrors.education = "Education is required";
    if (!occupation.trim()) newErrors.occupation = "Occupation is required";
    if (occupation.trim().length > 0 && occupation.trim().length < 2) newErrors.occupation = "Occupation must be at least 2 characters";
    if (!city.trim()) newErrors.city = "City is required";
    if (city.trim().length > 0 && city.trim().length < 2) newErrors.city = "City must be at least 2 characters";
    if (weight && (parseInt(weight) < 30 || parseInt(weight) > 200)) newErrors.weight = "Weight must be between 30-200 kg";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldError = {};
    const ageErr = validatePrefAge(prefAgeMin, prefAgeMax);
    if (ageErr) newErrors.prefAge = ageErr;
    if (bio.length > 500) newErrors.bio = "Bio must be under 500 characters";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const success = await register({
      fullName, email, phone, password, gender, dob, profilePhoto: "", // Reset to empty initially, we will upload to Storage next
      height, weight, complexion, maritalStatus,
      education, occupation, annualIncome,
      city, district, nativePlace, state: "Karnataka",
      gothra, nakshatra, rashi,
      fatherName, fatherOccupation, motherName, motherOccupation, siblings,
      bio,
      prefAgeMin, prefAgeMax, prefHeightMin, prefDistrict, prefEducation
    });
    if (success) {
      if (profilePhotoFile) {
        // Upload photo file to storage bucket and update db profile
        await useStore.getState().uploadPhoto(profilePhotoFile);
      }
      setShowSuccessModal(true);
    } else {
      const storeError = useStore.getState().error;
      setErrors({ submit: storeError || 'Registration failed. Please try again.' });
    }
  };

  const totalSteps = 3;
  const stepLabels = ["Basic Info", "Profile Details", "Family & Bio"];

  const selectStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", background: "#fafcff",
    border: "1px solid #e3e8f0", borderRadius: "12px",
    fontFamily: "'Inter', sans-serif", fontSize: "15px",
    color: "#1e2a44", outline: "none", height: "48px",
    transition: "all 0.25s ease", appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 16px center",
  };

  const ErrorMsg = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return (
      <span className="error-text">
        <AlertCircle style={{ width: "12px", height: "12px" }} /> {errors[field]}
      </span>
    );
  };

  return (
    <section style={{ minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#EFEBE3", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: "560px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #1e2a44, #2a3673)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <UserPlus style={{ width: "28px", height: "28px", color: "#fff" }} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, color: "#1e2a44", marginBottom: "6px" }}>Create Your Profile</h1>
          <p style={{ fontSize: "14px", color: "#5f6368" }}>Join Maduvedibbana and find your perfect match</p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", marginBottom: "28px" }}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 700,
                  background: step > s ? "#16a34a" : step === s ? "#1e2a44" : "#e3e8f0",
                  color: step >= s ? "#fff" : "#5f6368",
                  transition: "all 0.3s ease",
                }}>
                  {step > s ? <CheckCircle2 style={{ width: "18px", height: "18px" }} /> : s}
                </div>
                <span style={{ fontSize: "11px", fontWeight: 500, color: step >= s ? "#1e2a44" : "#a0aec0", whiteSpace: "nowrap" }}>{stepLabels[s - 1]}</span>
              </div>
              {s < totalSteps && (
                <div style={{ width: "48px", height: "2px", borderRadius: "1px", background: step > s ? "#16a34a" : "#e3e8f0", transition: "all 0.3s", marginBottom: "18px", marginLeft: "8px", marginRight: "8px" }} />
              )}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: "28px 36px" }}>
          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Full Name *</label>
                <div style={{ position: "relative" }}>
                  <User style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                  <input type="text" value={fullName} onChange={(e) => { setFullName(e.target.value); if (errors.fullName) { const ne = { ...errors }; delete ne.fullName; setErrors(ne); } }} className={`input ${errors.fullName ? 'input-error' : ''}`} style={{ paddingLeft: "44px" }} placeholder="Enter your full name" />
                </div>
                <ErrorMsg field="fullName" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Gender *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {(["MALE", "FEMALE"] as const).map((g) => (
                    <button key={g} type="button" onClick={() => { setGender(g); if (errors.gender) { const ne = { ...errors }; delete ne.gender; setErrors(ne); } }} style={{
                      padding: "12px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                      border: gender === g ? "2px solid #1e2a44" : errors.gender ? "2px solid #dc2626" : "2px solid #e3e8f0",
                      background: gender === g ? "rgba(30,42,68,0.05)" : "#fff",
                      color: gender === g ? "#1e2a44" : "#5f6368",
                      transition: "all 0.2s ease",
                    }}>
                      {g === "MALE" ? "👨 Male (Groom)" : "👩 Female (Bride)"}
                    </button>
                  ))}
                </div>
                <ErrorMsg field="gender" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Date of Birth *</label>
                  <div style={{ position: "relative" }}>
                    <Calendar style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                    <input type="date" value={dob} onChange={(e) => { setDob(e.target.value); if (errors.dob) { const ne = { ...errors }; delete ne.dob; setErrors(ne); } }} className={`input ${errors.dob ? 'input-error' : ''}`} style={{ paddingLeft: "44px" }} />
                  </div>
                  <ErrorMsg field="dob" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Mobile Number *</label>
                  <div style={{ position: "relative" }}>
                    <Phone style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                    <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); if (errors.phone) { const ne = { ...errors }; delete ne.phone; setErrors(ne); } }} className={`input ${errors.phone ? 'input-error' : ''}`} style={{ paddingLeft: "44px" }} placeholder="+91 98765 43210" />
                  </div>
                  <ErrorMsg field="phone" />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Email Address *</label>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) { const ne = { ...errors }; delete ne.email; setErrors(ne); } }} className={`input ${errors.email ? 'input-error' : ''}`} style={{ paddingLeft: "44px" }} placeholder="you@example.com" />
                </div>
                <ErrorMsg field="email" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "6px" }}>Create Password *</label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); if (errors.password) { const ne = { ...errors }; delete ne.password; setErrors(ne); } }} className={`input ${errors.password ? 'input-error' : ''}`} style={{ paddingLeft: "44px", paddingRight: "44px" }} placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#a0aec0" }}>
                    {showPassword ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
                  </button>
                </div>
                <ErrorMsg field="password" />
                {/* Password strength bar */}
                {password && (
                  <div style={{ marginTop: "8px" }}>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                          flex: 1, height: "4px", borderRadius: "2px",
                          background: getPasswordStrength() >= i ? strengthColors[getPasswordStrength()] : "#e3e8f0",
                          transition: "all 0.3s",
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: strengthColors[getPasswordStrength()] }}>
                      {strengthLabels[getPasswordStrength()]}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <input type="checkbox" id="terms" checked={acceptTerms} onChange={(e) => { setAcceptTerms(e.target.checked); if (errors.terms) { const ne = { ...errors }; delete ne.terms; setErrors(ne); } }} style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "#1e2a44" }} />
                <label htmlFor="terms" style={{ fontSize: "12px", color: errors.terms ? "#dc2626" : "#5f6368", lineHeight: 1.5, cursor: "pointer" }}>
                  I agree to the <Link href="/terms" style={{ color: "#005AEE", fontWeight: 500, textDecoration: "none" }}>Terms & Conditions</Link> and <Link href="/privacy-policy" style={{ color: "#005AEE", fontWeight: 500, textDecoration: "none" }}>Privacy Policy</Link>
                </label>
              </div>
              <ErrorMsg field="terms" />
              <button type="submit" className="btn-primary" style={{ width: "100%", height: "50px", marginTop: "4px" }}>
                <span>Continue</span> <ArrowRight style={{ width: "16px", height: "16px" }} />
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <Ruler style={{ width: "18px", height: "18px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44" }}>Personal Details</h3>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Profile Photo (Optional)</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Camera style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#a0aec0" }} />
                    <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoUpload} className="input" style={{ paddingLeft: "44px", paddingTop: "12px", paddingBottom: "12px" }} />
                  </div>
                  {profilePhoto && (
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", flexShrink: 0, overflow: "hidden", border: "1px solid #e3e8f0" }}>
                      <img src={profilePhoto} alt="Profile preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Height</label>
                  <select value={height} onChange={(e) => setHeight(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {heightOptions.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Weight (kg)</label>
                  <input type="number" value={weight} onChange={(e) => { setWeight(e.target.value); if (errors.weight) { const ne = { ...errors }; delete ne.weight; setErrors(ne); } }} className={`input ${errors.weight ? 'input-error' : ''}`} placeholder="65" min={30} max={200} />
                  <ErrorMsg field="weight" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Complexion</label>
                  <select value={complexion} onChange={(e) => setComplexion(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {complexionOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Marital Status *</label>
                  <select value={maritalStatus} onChange={(e) => { setMaritalStatus(e.target.value); if (errors.maritalStatus) { const ne = { ...errors }; delete ne.maritalStatus; setErrors(ne); } }} style={{ ...selectStyle, borderColor: errors.maritalStatus ? "#dc2626" : "#e3e8f0" }}>
                    <option value="">Select status</option>
                    {maritalStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ErrorMsg field="maritalStatus" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Annual Income</label>
                  <select value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {incomeOptions.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                <GraduationCap style={{ width: "18px", height: "18px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44" }}>Education & Career</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Education *</label>
                  <select value={education} onChange={(e) => { setEducation(e.target.value); if (errors.education) { const ne = { ...errors }; delete ne.education; setErrors(ne); } }} style={{ ...selectStyle, borderColor: errors.education ? "#dc2626" : "#e3e8f0" }}>
                    <option value="">Select education</option>
                    {educationOptions.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <ErrorMsg field="education" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Occupation *</label>
                  <input type="text" value={occupation} onChange={(e) => { setOccupation(e.target.value); if (errors.occupation) { const ne = { ...errors }; delete ne.occupation; setErrors(ne); } }} className={`input ${errors.occupation ? 'input-error' : ''}`} placeholder="e.g. Software Engineer" />
                  <ErrorMsg field="occupation" />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                <MapPin style={{ width: "18px", height: "18px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44" }}>Location</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>City *</label>
                  <input type="text" value={city} onChange={(e) => { setCity(e.target.value); if (errors.city) { const ne = { ...errors }; delete ne.city; setErrors(ne); } }} className={`input ${errors.city ? 'input-error' : ''}`} placeholder="e.g. Bengaluru" />
                  <ErrorMsg field="city" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>District</label>
                  <select value={district} onChange={(e) => setDistrict(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Native Place</label>
                  <input type="text" value={nativePlace} onChange={(e) => setNativePlace(e.target.value)} className="input" placeholder="e.g. Sirsi" />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                <Camera style={{ width: "18px", height: "18px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44" }}>Profile Photos (Recommended)</h3>
              </div>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                style={{ display: "none" }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {["Main Photo", "Side Photo (Opt)", "Side Photo (Opt)"].map((label, i) => {
                  const isMain = i === 0;
                  const hasPreview = isMain && profilePhoto;

                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (isMain) {
                          fileInputRef.current?.click();
                        } else {
                          alert("Optional side photos can be uploaded from profile settings later.");
                        }
                      }}
                      style={{
                        height: "100px",
                        borderRadius: "12px",
                        border: hasPreview ? "2px solid #16a34a" : "2px dashed #d4d8e0",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: isMain ? "pointer" : "not-allowed",
                        backgroundImage: hasPreview ? `url('${profilePhoto}')` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        position: "relative",
                        background: hasPreview ? undefined : "rgba(30,42,68,0.02)",
                        transition: "all 0.2s",
                      }}
                    >
                      {!hasPreview && (
                        <>
                          <Camera style={{ width: "20px", height: "20px", color: isMain ? "#c6a55c" : "#a0aec0", marginBottom: "4px" }} />
                          <span style={{ fontSize: "10px", color: "#5f6368", fontWeight: 500 }}>{label}</span>
                        </>
                      )}
                      {hasPreview && (
                        <div style={{
                          position: "absolute", bottom: 0, left: 0, right: 0,
                          background: "rgba(0,0,0,0.6)", padding: "4px",
                          borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px",
                          textAlign: "center", fontSize: "9px", color: "#fff", fontWeight: 600
                        }}>
                          Change Photo
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, height: "48px" }}>
                  <ArrowLeft style={{ width: "16px", height: "16px" }} /> <span>Back</span>
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2, height: "48px" }}>
                  <span>Continue</span> <ArrowRight style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <Heart style={{ width: "18px", height: "18px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44" }}>Religion Details</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Gothra</label>
                  <input type="text" value={gothra} onChange={(e) => setGothra(e.target.value)} className="input" placeholder="e.g. Kashyapa" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Nakshatra</label>
                  <select value={nakshatra} onChange={(e) => setNakshatra(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {nakshatraOptions.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Rashi</label>
                  <select value={rashi} onChange={(e) => setRashi(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {rashiOptions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                <Users style={{ width: "18px", height: "18px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44" }}>Family Details</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Father&apos;s Name</label>
                  <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="input" placeholder="Father's full name" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Father&apos;s Occupation</label>
                  <input type="text" value={fatherOccupation} onChange={(e) => setFatherOccupation(e.target.value)} className="input" placeholder="e.g. Retired Teacher" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Mother&apos;s Name</label>
                  <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} className="input" placeholder="Mother's full name" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Mother&apos;s Occupation</label>
                  <input type="text" value={motherOccupation} onChange={(e) => setMotherOccupation(e.target.value)} className="input" placeholder="e.g. Homemaker" />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Siblings</label>
                <input type="text" value={siblings} onChange={(e) => setSiblings(e.target.value)} className="input" placeholder="e.g. 1 brother (married), 1 sister (unmarried)" />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                <Heart style={{ width: "18px", height: "18px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44" }}>Partner Preferences</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Min Age</label>
                  <input type="number" value={prefAgeMin} onChange={(e) => { setPrefAgeMin(e.target.value); if (errors.prefAge) { const ne = { ...errors }; delete ne.prefAge; setErrors(ne); } }} className={`input ${errors.prefAge ? 'input-error' : ''}`} placeholder="e.g. 21" min={18} max={60} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Max Age</label>
                  <input type="number" value={prefAgeMax} onChange={(e) => { setPrefAgeMax(e.target.value); if (errors.prefAge) { const ne = { ...errors }; delete ne.prefAge; setErrors(ne); } }} className={`input ${errors.prefAge ? 'input-error' : ''}`} placeholder="e.g. 30" min={18} max={60} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Min Height</label>
                  <select value={prefHeightMin} onChange={(e) => setPrefHeightMin(e.target.value)} style={selectStyle}>
                    <option value="">Select</option>
                    {heightOptions.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
              <ErrorMsg field="prefAge" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Preferred District</label>
                  <select value={prefDistrict} onChange={(e) => setPrefDistrict(e.target.value)} style={selectStyle}>
                    <option value="">All Districts</option>
                    {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>Preferred Education</label>
                  <select value={prefEducation} onChange={(e) => setPrefEducation(e.target.value)} style={selectStyle}>
                    <option value="">All Educations</option>
                    {educationOptions.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                <Camera style={{ width: "18px", height: "18px", color: "#c6a55c" }} />
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1e2a44" }}>About Yourself</h3>
              </div>
              <div>
                <textarea value={bio} onChange={(e) => { setBio(e.target.value); if (errors.bio) { const ne = { ...errors }; delete ne.bio; setErrors(ne); } }} className={`input ${errors.bio ? 'input-error' : ''}`} style={{ minHeight: "90px", resize: "none", height: "auto" }} placeholder="Tell about yourself, your interests, hobbies, and what you're looking for in a partner..." rows={4} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <ErrorMsg field="bio" />
                  <span style={{ fontSize: "11px", color: bio.length > 500 ? "#dc2626" : "#a0aec0", fontWeight: 500, marginLeft: "auto" }}>
                    {bio.length}/500
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setStep(2)} className="btn-outline" style={{ flex: 1, height: "48px" }}>
                  <ArrowLeft style={{ width: "16px", height: "16px" }} /> <span>Back</span>
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2, height: "48px" }}>
                  <span>Create Profile</span> <CheckCircle2 style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            </form>
          )}

          <div style={{ textAlign: "center", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #e3e8f0" }}>
            <p style={{ fontSize: "14px", color: "#5f6368" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#005AEE", fontWeight: 600, textDecoration: "none" }}>Login here</Link>
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
              Registration Successful!
            </h3>
            <p style={{ fontSize: "15px", color: "#5f6368", lineHeight: 1.6, marginBottom: "24px" }}>
              Your account is created. We will verify it within 2-4 days. You will receive an update over mail once verified.
            </p>
            <button 
              onClick={() => router.push("/login")}
              style={{ width: "100%", height: "48px", background: "#1e2a44", color: "#fff", borderRadius: "12px", fontSize: "15px", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s ease" }}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
