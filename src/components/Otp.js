import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Otp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const contact = state.contact || sessionStorage.getItem("otpContact") || "";
  const maskedContact =
    state.maskedContact || sessionStorage.getItem("maskedContact") || contact;
  const contactIsPhone =
    state.contactIsPhone || sessionStorage.getItem("contactIsPhone") === "true";

  const [digits, setDigits] = useState(["", "", "", ""]);
  const inputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [seconds, setSeconds] = useState(44);
  const [isValid, setIsValid] = useState(null);
  const [message, setMessage] = useState("");
  const [resendCount, setResendCount] = useState(0);

  useEffect(() => {
    if (contact) {
      sessionStorage.setItem("otpContact", contact);
      sessionStorage.setItem("maskedContact", maskedContact);
      sessionStorage.setItem(
        "contactIsPhone",
        contactIsPhone ? "true" : "false"
      );
    }
  }, [contact, maskedContact, contactIsPhone]);

  useEffect(() => {
    setSeconds(44);
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCount]);

  useEffect(() => {
    inputsRef[0].current && inputsRef[0].current.focus();
  }, []);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
    setDigits((prev) => {
      const newDigits = [...prev];
      newDigits[idx] = val;
      return newDigits;
    });
    if (val && idx < inputsRef.length - 1) {
      inputsRef[idx + 1].current.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputsRef[idx - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData
      .getData("Text")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (!paste) return;
    const arr = paste.split("");
    setDigits((prev) => {
      const newDigits = [...prev];
      for (let i = 0; i < 4; i++) {
        newDigits[i] = arr[i] || "";
      }
      return newDigits;
    });
    const lastFilled = Math.min(3, arr.length - 1);
    inputsRef[lastFilled].current.focus();
    e.preventDefault();
  };

  const handleResend = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    sessionStorage.setItem("loginOtp", otp);
    console.log("Resent OTP (demo):", otp);
    setResendCount((c) => c + 1);
    setMessage("OTP resent");
  };

  const handleVerify = () => {
    const entered = digits.join("");
    const stored = sessionStorage.getItem("loginOtp");
    if (entered === stored) {
      setMessage("Verification successful!");
      setIsValid(true);
      setTimeout(() => {
        alert("Login successful!");
        navigate("/", { replace: true });
      }, 500);
    } else {
      setMessage("Invalid code. Please try again.");
      setIsValid(false);
    }
  };

  const canResend = seconds === 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 font-poppins px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
        {/* Logo (same style as Login) */}
        <div className="flex justify-center mb-6">
          <img
            src="https://images.unsplash.com/photo-1750535135593-3a8e5def331d?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=700"
            alt="logo"
            className="w-28 rounded-lg"
          />
        </div>

        {/* Title with back arrow and fallback support */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <img
            src="/images/arrow-left.png"
            alt="arrow-left"
            className="w-4 h-4 cursor-pointer filter brightness-0 invert-[40%] flex mt-1"
            onClick={() => navigate(-1)}
            onError={(e) => {
              // fallback: agar image load na ho to emoji show karo
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml;base64," +
                btoa(`
          <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='black'>
            <path d='M12 4l-1.41 1.41L15.17 10H4v2h11.17l-4.58 4.59L12 18l6-6z'/>
          </svg>
        `);
            }}
          />
          <h2 className="text-2xl font-semibold ml-1">OTP Code Verification</h2>
        </div>
        {/* <h2 className="text-2xl font-semibold mb-2">Enter OTP</h2> */}
        <p className="text-sm text-gray-600 mb-6">
          Code has been sent to{" "}
          <span className="font-medium text-gray-800">{maskedContact}</span>
        </p>

        {/* OTP boxes */}
        <div className="flex justify-center gap-3 mb-4" onPaste={handlePaste}>
          {digits.map((d, idx) => (
            <input
              key={idx}
              ref={inputsRef[idx]}
              value={d}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-14 h-14 text-center text-xl font-medium rounded-md border-[1px] border-[#46C2DE] bg-[#24F0FD14] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ))}
        </div>

        {message && (
          <p
            className={`text-sm mb-2 ${
              isValid ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Resend section centered */}
        <div className="text-center mb-4">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-blue-500 font-medium hover:underline"
            >
              Resend Code
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Resend code in <span className="text-blue-500">{seconds}s</span>
            </p>
          )}
        </div>

        {/* Full width Verify button */}
        <button
          onClick={handleVerify}
          disabled={digits.join("").length < 4}
          className={`w-full py-2 rounded-md font-semibold transition-colors ${
            digits.join("").length === 4
              ? "bg-blue-400 text-white hover:bg-blue-500"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          }`}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default Otp;
