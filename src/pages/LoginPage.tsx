import { useState } from "react";
import { supabase } from "../auth/supabase";

export function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) setAuthError(error.message);
    else setOtpSent(true);

    setLoading(false);
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) setAuthError(error.message);
    // On success, onAuthStateChange in AuthContext picks up the new session
    // automatically — no manual redirect needed here if routes are set up
    // to react to `claims` changing.

    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setAuthError(error.message);
    setLoading(false);
  };

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
            onChange={(e) => setOtp(e.target.value)}
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

  return (
    <div>
      <h1>Sign in</h1>
      {authError && <p style={{ color: "red" }}>{authError}</p>}

      <form onSubmit={handleSendOtp}>
        <input
          type="email"
          placeholder="Your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={loading}>
          {loading ? "Sending..." : "Send code"}
        </button>
      </form>
    </div>
  );
}
