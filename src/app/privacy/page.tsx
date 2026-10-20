import LegalShell from "@/components/LegalShell";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = { title: "Privacy Policy | Anovibe" };

export default function Privacy() {
  return (
    <LegalShell title="Privacy Policy" updated="October 8, 2026">
      <p>Anovibe is built so people can send honest messages without revealing who they are. This page explains what we collect and why.</p>
      <h2>If you have an account</h2>
      <ul>
        <li>Email address, username, and a securely hashed password (we never store your password itself).</li>
        <li>Optional display name, bio, theme, and profile picture (from Google if you sign in with Google).</li>
        <li>The messages you receive, plus your likes, replies, blocks and reports.</li>
      </ul>
      <h2>If you send a message</h2>
      <p>You don&apos;t need an account. We store your message text, its category, and a salted hash made from your network address and a cookie on your device. We don&apos;t store your raw IP address, and the recipient never sees the hash. We use it only to limit spam and to make blocking work.</p>
      <h2>Cookies</h2>
      <ul>
        <li>A session cookie keeps account holders logged in.</li>
        <li>A device cookie (<code>av_d</code>) is set when you send a message, for rate limiting and blocking.</li>
      </ul>
      <p>We don&apos;t use advertising or tracking cookies.</p>
      <h2>Who we share data with</h2>
      <p>We don&apos;t sell your data. We use service providers to run Anovibe: a hosting provider, a database provider, and Google if you choose Google sign-in. We may disclose information if the law requires it.</p>
      <h2>Your choices</h2>
      <ul>
        <li>Delete any message from your inbox at any time.</li>
        <li>Edit your profile details in Settings.</li>
        <li>To delete your account and everything linked to it, email us.</li>
      </ul>
      <h2>Security and age</h2>
      <p>We use encrypted connections and hashed passwords, but no service is perfectly secure. Anovibe is for people 13 and older.</p>
      <h2>Contact</h2>
      <p>Questions or requests: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We may update this policy and will change the date above when we do.</p>
    </LegalShell>
  );
}
