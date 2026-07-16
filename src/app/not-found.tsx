import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <main style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "40px 20px",
        background: "#fdfbf7",
        textAlign: "center"
      }}>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(198, 165, 92, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px"
        }}>
          <AlertCircle style={{ width: "40px", height: "40px", color: "#c6a55c" }} />
        </div>
        
        <h1 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: "120px", 
          fontWeight: 700, 
          color: "#1e2a44", 
          margin: 0,
          lineHeight: 1
        }}>
          404
        </h1>
        
        <h2 style={{ 
          fontSize: "24px", 
          fontWeight: 600, 
          color: "#1e2a44", 
          margin: "16px 0 8px" 
        }}>
          Page Not Found
        </h2>
        
        <p style={{ 
          fontSize: "16px", 
          color: "#5f6368", 
          maxWidth: "400px", 
          lineHeight: 1.6,
          marginBottom: "32px" 
        }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          href="/" 
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #1e2a44, #2b3c61)",
            color: "#ffffff",
            padding: "14px 32px",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "15px",
            boxShadow: "0 8px 24px rgba(30, 42, 68, 0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 28px rgba(30, 42, 68, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(30, 42, 68, 0.2)";
          }}
        >
          <Home style={{ width: "18px", height: "18px" }} />
          Return to Homepage
        </Link>
      </main>

      <Footer />
    </div>
  );
}
