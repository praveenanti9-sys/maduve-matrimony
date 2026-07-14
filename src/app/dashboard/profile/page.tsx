"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import {
  User, Camera, MapPin, GraduationCap, Briefcase, Calendar,
  Heart, Edit3, CheckCircle2, AlertCircle, Save, X,
  Ruler, Users, Sparkles, Phone, Mail, Home, Ban,
} from "lucide-react";

interface ValidationErrors { [key: string]: string }

export default function ProfilePage() {
  const { currentUser, updateProfile, uploadPhoto } = useStore();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // All editable fields
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [dob, setDob] = useState(currentUser.dob);
  const [height, setHeight] = useState(currentUser.height);
  const [weight, setWeight] = useState(currentUser.weight);
  const [complexion, setComplexion] = useState(currentUser.complexion);
  const [maritalStatus, setMaritalStatus] = useState(currentUser.maritalStatus);
  const [city, setCity] = useState(currentUser.city);
  const [district, setDistrict] = useState(currentUser.district);
  const [nativePlace, setNativePlace] = useState(currentUser.nativePlace);
  const [education, setEducation] = useState(currentUser.education);
  const [occupation, setOccupation] = useState(currentUser.occupation);
  const [annualIncome, setAnnualIncome] = useState(currentUser.annualIncome);
  const [gothra, setGothra] = useState(currentUser.gothra);
  const [nakshatra, setNakshatra] = useState(currentUser.nakshatra);
  const [rashi, setRashi] = useState(currentUser.rashi);
  const [fatherName, setFatherName] = useState(currentUser.fatherName);
  const [fatherOccupation, setFatherOccupation] = useState(currentUser.fatherOccupation);
  const [motherName, setMotherName] = useState(currentUser.motherName);
  const [motherOccupation, setMotherOccupation] = useState(currentUser.motherOccupation);
  const [siblings, setSiblings] = useState(currentUser.siblings);
  const [bio, setBio] = useState(currentUser.bio);
  const [phone, setPhone] = useState(currentUser.phone);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");

  // Partner Preferences
  const [prefAgeMin, setPrefAgeMin] = useState(currentUser.prefAgeMin || "");
  const [prefAgeMax, setPrefAgeMax] = useState(currentUser.prefAgeMax || "");
  const [prefHeightMin, setPrefHeightMin] = useState(currentUser.prefHeightMin || "");
  const [prefDistrict, setPrefDistrict] = useState(currentUser.prefDistrict || "");
  const [prefEducation, setPrefEducation] = useState(currentUser.prefEducation || "");

  useEffect(() => {
    setFullName(currentUser.fullName);
    setDob(currentUser.dob);
    setHeight(currentUser.height);
    setWeight(currentUser.weight);
    setComplexion(currentUser.complexion);
    setMaritalStatus(currentUser.maritalStatus);
    setCity(currentUser.city);
    setDistrict(currentUser.district);
    setNativePlace(currentUser.nativePlace);
    setEducation(currentUser.education);
    setOccupation(currentUser.occupation);
    setAnnualIncome(currentUser.annualIncome);
    setGothra(currentUser.gothra);
    setNakshatra(currentUser.nakshatra);
    setRashi(currentUser.rashi);
    setFatherName(currentUser.fatherName);
    setFatherOccupation(currentUser.fatherOccupation);
    setMotherName(currentUser.motherName);
    setMotherOccupation(currentUser.motherOccupation);
    setSiblings(currentUser.siblings);
    setBio(currentUser.bio);
    setPhone(currentUser.phone);
    setPrefAgeMin(currentUser.prefAgeMin || "");
    setPrefAgeMax(currentUser.prefAgeMax || "");
    setPrefHeightMin(currentUser.prefHeightMin || "");
    setPrefDistrict(currentUser.prefDistrict || "");
    setPrefEducation(currentUser.prefEducation || "");
  }, [currentUser]);

  const allFields = [
    fullName, currentUser.email, phone, currentUser.gender, dob,
    education, occupation, city, height, maritalStatus,
    gothra, nakshatra, rashi, bio, weight, complexion, annualIncome,
    nativePlace, fatherName, fatherOccupation, motherName, motherOccupation,
    siblings, prefAgeMin, prefAgeMax, prefHeightMin, prefDistrict, prefEducation
  ];
  const filledFields = allFields.filter(Boolean).length;
  const completeness = Math.round((filledFields / allFields.length) * 100);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleSave = () => {
    const errs: ValidationErrors = {};
    
    // Validate name
    if (!fullName.trim()) errs.fullName = "Full name is required";
    else if (fullName.trim().length < 3) errs.fullName = "Name must be at least 3 characters";
    else if (!/^[a-zA-Z\s.]+$/.test(fullName.trim())) errs.fullName = "Name can only contain letters, spaces, and dots";
    
    // Validate DOB (Legal age)
    if (dob) {
      const birth = new Date(dob);
      const now = new Date();
      const age = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (currentUser.gender === 'MALE' && age < 21) errs.dob = "Legal marriage age for men is 21+";
      if (currentUser.gender === 'FEMALE' && age < 18) errs.dob = "Legal marriage age for women is 18+";
      if (age > 60) errs.dob = "Age must be below 60 years";
    }
    
    // Validate phone
    if (phone) {
      const cleaned = phone.replace(/[\s+\-()]/g, '');
      const digits = cleaned.replace(/^91/, '');
      if (!/^[6-9]\d{9}$/.test(digits)) errs.phone = "Enter a valid 10-digit Indian mobile number";
    }

    // Validate weight
    if (weight && (parseInt(weight) < 30 || parseInt(weight) > 200)) errs.weight = "Weight must be between 30-200 kg";
    
    // Validate partner pref age
    if (prefAgeMin && prefAgeMax) {
      if (parseInt(prefAgeMin) > parseInt(prefAgeMax)) errs.prefAge = "Min age cannot exceed max age";
      if (parseInt(prefAgeMin) < 18 || parseInt(prefAgeMax) > 60) errs.prefAge = "Age range must be 18-60";
    }
    
    // Validate bio
    if (bio && bio.length > 500) errs.bio = "Bio must be under 500 characters";
    
    setValidationErrors(errs);
    if (Object.keys(errs).length > 0) return;

    updateProfile({
      fullName, dob, height, weight, complexion, maritalStatus,
      city, district, nativePlace, education, occupation, annualIncome,
      gothra, nakshatra, rashi,
      fatherName, fatherOccupation, motherName, motherOccupation, siblings,
      bio, phone,
      prefAgeMin, prefAgeMax, prefHeightMin, prefDistrict, prefEducation
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };


  const handleCancel = () => {
    // Reset all to current store values
    setFullName(currentUser.fullName);
    setDob(currentUser.dob);
    setHeight(currentUser.height);
    setWeight(currentUser.weight);
    setComplexion(currentUser.complexion);
    setMaritalStatus(currentUser.maritalStatus);
    setCity(currentUser.city);
    setDistrict(currentUser.district);
    setNativePlace(currentUser.nativePlace);
    setEducation(currentUser.education);
    setOccupation(currentUser.occupation);
    setAnnualIncome(currentUser.annualIncome);
    setGothra(currentUser.gothra);
    setNakshatra(currentUser.nakshatra);
    setRashi(currentUser.rashi);
    setFatherName(currentUser.fatherName);
    setFatherOccupation(currentUser.fatherOccupation);
    setMotherName(currentUser.motherName);
    setMotherOccupation(currentUser.motherOccupation);
    setSiblings(currentUser.siblings);
    setBio(currentUser.bio);
    setPhone(currentUser.phone);
    setPrefAgeMin(currentUser.prefAgeMin || "");
    setPrefAgeMax(currentUser.prefAgeMax || "");
    setPrefHeightMin(currentUser.prefHeightMin || "");
    setPrefDistrict(currentUser.prefDistrict || "");
    setPrefEducation(currentUser.prefEducation || "");
    setEditing(false);
  };

  const calculateAge = (dobStr: string) => {
    if (!dobStr) return "";
    const birth = new Date(dobStr);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)) + " years";
  };

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "8px 0" }}>
      <Icon style={{ width: "16px", height: "16px", color: "#a0aec0", marginTop: "2px", flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: "11px", color: "#a0aec0", fontWeight: 500, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{label}</div>
        <div style={{ fontSize: "14px", fontWeight: 500, color: value && value !== "—" ? "#1e2a44" : "#a0aec0", marginTop: "2px" }}>{value || "—"}</div>
      </div>
    </div>
  );

  const EditField = ({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5f6368", marginBottom: "4px" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input" style={{ height: "42px", fontSize: "14px" }} placeholder={placeholder} />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "#1e2a44", marginBottom: "4px" }}>My Profile</h1>
          <p style={{ fontSize: "14px", color: "#5f6368" }}>Manage your profile details and photos</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-primary" style={{ padding: "10px 20px", fontSize: "14px" }}>
            <Edit3 style={{ width: "16px", height: "16px" }} /> <span>Edit Profile</span>
          </button>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleCancel} className="btn-outline" style={{ padding: "10px 20px", fontSize: "14px" }}>
              <X style={{ width: "16px", height: "16px" }} /> <span>Cancel</span>
            </button>
            <button onClick={handleSave} className="btn-primary" style={{ padding: "10px 20px", fontSize: "14px" }}>
              <Save style={{ width: "16px", height: "16px" }} /> <span>Save</span>
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(22,163,106,0.08)", color: "#16a34a", fontSize: "14px", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle2 style={{ width: "16px", height: "16px" }} /> Profile saved successfully!
        </div>
      )}

      {/* Completeness Bar */}
      <div className="card" style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px", color: "#1e2a44" }}>
            {completeness === 100 ? (
              <CheckCircle2 style={{ width: "16px", height: "16px", color: "#16a34a" }} />
            ) : (
              <AlertCircle style={{ width: "16px", height: "16px", color: "#f59e0b" }} />
            )}
            Profile Completeness
          </span>
          <span style={{ fontSize: "14px", fontWeight: 700, color: completeness === 100 ? "#16a34a" : "#1e2a44" }}>{completeness}%</span>
        </div>
        <div style={{ width: "100%", height: "8px", background: "#e3e8f0", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{ width: `${completeness}%`, height: "100%", background: completeness === 100 ? "#16a34a" : "linear-gradient(90deg, #1e2a44, #c6a55c)", borderRadius: "999px", transition: "width 0.5s ease" }} />
        </div>
        {completeness < 100 && <p style={{ fontSize: "12px", color: "#5f6368", marginTop: "6px" }}>Complete all fields to improve your match visibility</p>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px" }}>
        {/* Left Column: Photo + Quick Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Photo */}
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", color: "#1e2a44" }}>
              <Camera style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Photos
            </h3>
            <div style={{ display: "grid", gap: "10px" }}>
              <div 
                onClick={() => setShowPhotoModal(true)}
                style={{ 
                  height: "200px", 
                  borderRadius: "12px", 
                  backgroundImage: currentUser.profilePhoto ? `url('${currentUser.profilePhoto}')` : "none", 
                  background: currentUser.profilePhoto ? undefined : "linear-gradient(135deg, rgba(30,42,68,0.08), rgba(198,165,92,0.08))", 
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  border: currentUser.profilePhoto ? "1px solid #e3e8f0" : "2px dashed #d4d8e0", 
                  cursor: "pointer", 
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {!currentUser.profilePhoto ? (
                  <>
                    <div style={{
                      width: "80px", height: "80px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #1e2a44, #c6a55c)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "32px", fontWeight: 700, marginBottom: "12px",
                    }}>
                      {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : "U"}
                    </div>
                    <span style={{ fontSize: "12px", color: "#5f6368", fontWeight: 600 }}>Choose Profile Photo</span>
                  </>
                ) : (
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(30, 42, 68, 0.75)",
                    color: "#fff",
                    padding: "8px",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}>
                    <Camera style={{ width: "14px", height: "14px" }} />
                    Change Photo
                  </div>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[1, 2].map((i) => (
                  <div key={i} style={{ height: "100px", borderRadius: "12px", background: "#f0ece4", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #d4d8e0", cursor: "pointer" }}>
                    <Camera style={{ width: "18px", height: "18px", color: "#a0aec0" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, background: currentUser.email ? "rgba(22,163,106,0.1)" : "rgba(245,158,11,0.1)", color: currentUser.email ? "#16a34a" : "#d97706" }}>
                  <CheckCircle2 style={{ width: "12px", height: "12px" }} /> {currentUser.email ? "Email Verified" : "Pending Verification"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, background: "rgba(198,165,92,0.15)", color: "#8B6914" }}>
                  {currentUser.gender === "MALE" ? "👨 Groom" : currentUser.gender === "FEMALE" ? "👩 Bride" : "Gender not set"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, background: "rgba(30,42,68,0.06)", color: "#1e2a44" }}>
                  Profile ID: {currentUser.id.toUpperCase().slice(0, 8)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Personal Details */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", color: "#1e2a44" }}>
              <User style={{ width: "18px", height: "18px", color: "#1e2a44" }} /> Personal Details
            </h3>

            {editing ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <EditField label="Full Name" value={fullName} onChange={setFullName} placeholder="Your full name" />
                <EditField label="Date of Birth" value={dob} onChange={setDob} type="date" />
                <EditField label="Phone" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
                <EditField label="Height" value={height} onChange={setHeight} placeholder={"e.g. 5'10\""} />
                <EditField label="Weight (kg)" value={weight} onChange={setWeight} type="number" placeholder="65" />
                <EditField label="Complexion" value={complexion} onChange={setComplexion} placeholder="e.g. Fair" />
                <EditField label="Marital Status" value={maritalStatus} onChange={setMaritalStatus} placeholder="e.g. Never Married" />
                <EditField label="Annual Income" value={annualIncome} onChange={setAnnualIncome} placeholder="e.g. ₹10-15 Lakhs" />
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" }}>
                <InfoRow label="Full Name" value={fullName} icon={User} />
                <InfoRow label="Age" value={calculateAge(dob)} icon={Calendar} />
                <InfoRow label="Phone" value={phone} icon={Phone} />
                <InfoRow label="Email" value={currentUser.email} icon={Mail} />
                <InfoRow label="Height" value={height} icon={Ruler} />
                <InfoRow label="Weight" value={weight ? `${weight} kg` : ""} icon={Ruler} />
                <InfoRow label="Complexion" value={complexion} icon={User} />
                <InfoRow label="Marital Status" value={maritalStatus} icon={Heart} />
                <InfoRow label="Annual Income" value={annualIncome} icon={Briefcase} />
              </div>
            )}
          </div>

          {/* Education & Location */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", color: "#1e2a44" }}>
              <GraduationCap style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Education & Location
            </h3>
            {editing ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <EditField label="Education" value={education} onChange={setEducation} placeholder="e.g. BTech" />
                <EditField label="Occupation" value={occupation} onChange={setOccupation} placeholder="e.g. Software Engineer" />
                <EditField label="City" value={city} onChange={setCity} placeholder="e.g. Bengaluru" />
                <EditField label="District" value={district} onChange={setDistrict} placeholder="e.g. Uttara Kannada" />
                <EditField label="Native Place" value={nativePlace} onChange={setNativePlace} placeholder="e.g. Sirsi" />
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" }}>
                <InfoRow label="Education" value={education} icon={GraduationCap} />
                <InfoRow label="Occupation" value={occupation} icon={Briefcase} />
                <InfoRow label="City" value={city} icon={MapPin} />
                <InfoRow label="District" value={district} icon={MapPin} />
                <InfoRow label="Native Place" value={nativePlace} icon={Home} />
              </div>
            )}
          </div>

          {/* Religion */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", color: "#1e2a44" }}>
              <Sparkles style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Religion Details
            </h3>
            {editing ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <EditField label="Gothra" value={gothra} onChange={setGothra} placeholder="e.g. Kashyapa" />
                <EditField label="Nakshatra" value={nakshatra} onChange={setNakshatra} placeholder="e.g. Rohini" />
                <EditField label="Rashi" value={rashi} onChange={setRashi} placeholder="e.g. Vrishabha" />
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 24px" }}>
                <InfoRow label="Gothra" value={gothra} icon={Heart} />
                <InfoRow label="Nakshatra" value={nakshatra} icon={Sparkles} />
                <InfoRow label="Rashi" value={rashi} icon={Sparkles} />
              </div>
            )}
          </div>

          {/* Family */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", color: "#1e2a44" }}>
              <Users style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Family Details
            </h3>
            {editing ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <EditField label="Father's Name" value={fatherName} onChange={setFatherName} />
                <EditField label="Father's Occupation" value={fatherOccupation} onChange={setFatherOccupation} />
                <EditField label="Mother's Name" value={motherName} onChange={setMotherName} />
                <EditField label="Mother's Occupation" value={motherOccupation} onChange={setMotherOccupation} />
                <div style={{ gridColumn: "span 2" }}>
                  <EditField label="Siblings" value={siblings} onChange={setSiblings} placeholder="e.g. 1 brother (married), 1 sister" />
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" }}>
                <InfoRow label="Father's Name" value={fatherName} icon={User} />
                <InfoRow label="Father's Occupation" value={fatherOccupation} icon={Briefcase} />
                <InfoRow label="Mother's Name" value={motherName} icon={User} />
                <InfoRow label="Mother's Occupation" value={motherOccupation} icon={Briefcase} />
                <div style={{ gridColumn: "span 2" }}>
                  <InfoRow label="Siblings" value={siblings} icon={Users} />
                </div>
              </div>
            )}
          </div>

          {/* Partner Preferences */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", color: "#1e2a44" }}>
              <Heart style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> Partner Preferences
            </h3>
            {editing ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <EditField label="Preferred Min Age" value={prefAgeMin} onChange={setPrefAgeMin} placeholder="e.g. 21" type="number" />
                <EditField label="Preferred Max Age" value={prefAgeMax} onChange={setPrefAgeMax} placeholder="e.g. 28" type="number" />
                <EditField label="Preferred Min Height" value={prefHeightMin} onChange={setPrefHeightMin} placeholder={"e.g. 5'3\""} />
                <EditField label="Preferred District" value={prefDistrict} onChange={setPrefDistrict} placeholder="e.g. Bengaluru Urban" />
                <div style={{ gridColumn: "span 2" }}>
                  <EditField label="Preferred Education" value={prefEducation} onChange={setPrefEducation} placeholder="e.g. BE, BTech, MBA" />
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px" }}>
                <InfoRow label="Preferred Age" value={prefAgeMin && prefAgeMax ? `${prefAgeMin} - ${prefAgeMax} years` : prefAgeMin ? `${prefAgeMin}+ years` : prefAgeMax ? `Up to ${prefAgeMax} years` : ""} icon={Calendar} />
                <InfoRow label="Preferred Min Height" value={prefHeightMin} icon={Ruler} />
                <InfoRow label="Preferred District" value={prefDistrict} icon={MapPin} />
                <div style={{ gridColumn: "span 2" }}>
                  <InfoRow label="Preferred Education" value={prefEducation} icon={GraduationCap} />
                </div>
              </div>
            )}
          </div>

          {/* About */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", color: "#1e2a44" }}>
              <Heart style={{ width: "18px", height: "18px", color: "#c6a55c" }} /> About Myself
            </h3>
            {editing ? (
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input" style={{ minHeight: "100px", resize: "none", height: "auto" }} placeholder="Tell about yourself, your interests, and what you're looking for..." />
            ) : (
              <p style={{ fontSize: "14px", color: bio ? "#5f6368" : "#a0aec0", lineHeight: 1.7 }}>
                {bio || "No bio added yet. Click Edit Profile to add one."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Photo Chooser Modal */}
      {showPhotoModal && (
        <div style={{ 
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", 
          zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", 
          padding: "20px" 
        }} onClick={() => setShowPhotoModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ 
            width: "100%", maxWidth: "500px", background: "#fff", 
            borderRadius: "20px", padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Camera style={{ width: "20px", height: "20px", color: "#c6a55c" }} />
                <h3 style={{ fontWeight: 700, fontSize: "18px", color: "#1e2a44", margin: 0 }}>Select Profile Photo</h3>
              </div>
              <button onClick={() => setShowPhotoModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a0aec0" }}>
                <X style={{ width: "20px", height: "20px" }} />
              </button>
            </div>

            {/* Upload Local Image File */}
            <div style={{ marginBottom: "20px", borderBottom: "1px solid #e3e8f0", paddingBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "8px" }}>Upload Photo from Device</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      alert("Image must be smaller than 2MB");
                      return;
                    }
                    const url = await uploadPhoto(file);
                    if (url) {
                      setShowPhotoModal(false);
                    } else {
                      alert("Upload failed. Please try again.");
                    }
                  }
                }} 
                style={{
                  fontSize: "13px", color: "#5f6368",
                  padding: "8px", background: "#fafcff",
                  border: "1px dashed #c6a55c", borderRadius: "12px",
                  width: "100%", cursor: "pointer",
                }}
              />
            </div>

            {/* Custom Photo URL Input */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "8px" }}>Paste Custom Image URL</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="text" 
                  value={customPhotoUrl} 
                  onChange={(e) => setCustomPhotoUrl(e.target.value)} 
                  className="input" 
                  placeholder="https://images.unsplash.com/photo-..." 
                  style={{ flex: 1, height: "42px", fontSize: "13px" }}
                />
                <button 
                  onClick={() => {
                    if (customPhotoUrl.trim()) {
                      updateProfile({ profilePhoto: customPhotoUrl.trim() });
                      setShowPhotoModal(false);
                      setCustomPhotoUrl("");
                    }
                  }} 
                  disabled={!customPhotoUrl.trim()}
                  className="btn-primary" 
                  style={{ height: "42px", padding: "0 16px", fontSize: "13px", opacity: customPhotoUrl.trim() ? 1 : 0.5 }}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Premium Presets */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1e2a44", marginBottom: "12px" }}>Or Choose a Premium Avatar Preset</label>
              
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#c6a55c", letterSpacing: "1px", textTransform: "uppercase" }}>Groom Presets</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "8px" }}>
                  {[
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
                    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces"
                  ].map((url, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        updateProfile({ profilePhoto: url });
                        setShowPhotoModal(false);
                      }}
                      style={{ 
                        width: "100%", 
                        paddingBottom: "100%", 
                        borderRadius: "10px", 
                        backgroundImage: `url('${url}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "2px solid transparent",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                        position: "relative",
                        transition: "transform 0.2s"
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#c6a55c", letterSpacing: "1px", textTransform: "uppercase" }}>Bride Presets</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "8px" }}>
                  {[
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces"
                  ].map((url, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        updateProfile({ profilePhoto: url });
                        setShowPhotoModal(false);
                      }}
                      style={{ 
                        width: "100%", 
                        paddingBottom: "100%", 
                        borderRadius: "10px", 
                        backgroundImage: `url('${url}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "2px solid transparent",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                        position: "relative",
                        transition: "transform 0.2s"
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
