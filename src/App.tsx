import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./auth/supabase";

type Role = "admin" | "client" | "user";

type Claims = {
  email?: string;
  sub?: string;
  role?: string; // Postgres role (e.g. "authenticated") — not the same as user_role
  user_role?: Role; // our custom claim from the access token hook
  aud?: string;
  [key: string]: unknown;
};

export default function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [claims, setClaims] = useState<Claims | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const role: Role = (claims?.user_role as Role) ?? "user";

  useEffect(() => {
    const loadClaims = async () => {
      const { data, error } = await supabase.auth.getClaims();

      if (error || !data) {
        setClaims(null);
        return;
      }

      setClaims(data.claims as Claims | null);
    };

    loadClaims();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      const { data, error } = await supabase.auth.getClaims();

      if (error || !data) {
        setClaims(null);
        return;
      }

      setClaims(data.claims as Claims | null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSendOtp = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setAuthError(error.message);
    } else {
      setOtpSent(true);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      setAuthError(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setClaims(null);
    setEmail("");
    setOtp("");
    setOtpSent(false);
  };

  const handleResendOtp = async (): Promise<void> => {
    setLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setAuthError(error.message);
    }
    setLoading(false);
  };

  // Logged in
  if (claims) {
    return (
      <div>
        <h1>Welcome!</h1>
        <p>You are logged in as: {claims.email}</p>
        <p>Role: {role}</p>

        {role === "admin" && (
          <div>
            <h2>Admin Panel</h2>
            <p>Manage users and clients here.</p>
          </div>
        )}

        {role === "client" && (
          <div>
            <h2>Client Dashboard</h2>
            <p>Manage your users here.</p>
          </div>
        )}

        {role === "user" && (
          <div>
            <h2>Your Account</h2>
            <p>Standard user view.</p>
          </div>
        )}

        <button onClick={handleLogout}>Sign Out</button>
      </div>
    );
  }

  // Step 2: enter the OTP code
  if (otpSent) {
    return (
      <div>
        <h1>Enter your code</h1>
        <p>We sent a 6-digit code to {email}</p>

        {authError && <p style={{ color: "red" }}>{authError}</p>}

        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="123456"
            required
            value={otp}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOtp(e.target.value)
            }
          />

          <button disabled={loading}>
            {loading ? "Verifying..." : "Verify code"}
          </button>
        </form>

        <button onClick={handleResendOtp} disabled={loading}>
          Resend code
        </button>

        <button
          onClick={() => {
            setOtpSent(false);
            setOtp("");
            setAuthError(null);
          }}
        >
          Use a different email
        </button>
      </div>
    );
  }

  // Step 1: enter email
  return (
    <div>
      <h1>Supabase + React</h1>
      <p>Sign in with your email below</p>

      {authError && <p style={{ color: "red" }}>{authError}</p>}

      <form onSubmit={handleSendOtp}>
        <input
          type="email"
          placeholder="Your email"
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />

        <button disabled={loading}>
          {loading ? "Sending..." : "Send code"}
        </button>
      </form>
    </div>
  );
}
