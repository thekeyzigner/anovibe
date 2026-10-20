import LegalShell from "@/components/LegalShell";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = { title: "Terms of Service | Anovibe" };

export default function Terms() {
  return (
    <LegalShell title="Terms of Service" updated="October 8, 2026">
      <p>By creating an account or sending a message on Anovibe, you agree to these terms.</p>
      <h2>Who can use Anovibe</h2>
      <p>You must be at least 13 years old. You are responsible for your account and for keeping your password safe.</p>
      <h2>What you can&apos;t do</h2>
      <ul>
        <li>Harass, threaten, bully or shame anyone.</li>
        <li>Post hate speech, sexual content involving minors, or anything illegal.</li>
        <li>Share someone else&apos;s private information.</li>
        <li>Spam, or try to get around rate limits or blocks.</li>
        <li>Impersonate other people or lie about who you are.</li>
      </ul>
      <h2>Anonymity is not a shield</h2>
      <p>Messages are anonymous to the people who receive them, but you are still responsible for what you send. We may remove content, suspend accounts, and respond to valid legal requests using the limited data we hold.</p>
      <h2>Your content</h2>
      <p>You keep ownership of what you write. By posting it on Anovibe, you give us permission to store and display it so the service works, for example showing your replies on your public page.</p>
      <h2>Reports and moderation</h2>
      <p>Anyone can report a message. We may review reported messages and remove content or accounts that break these terms.</p>
      <h2>Service changes and availability</h2>
      <p>Anovibe is provided as is. We may change or stop features, and we don&apos;t promise the service will always be available or error-free. To the extent the law allows, we aren&apos;t liable for indirect or consequential losses.</p>
      <h2>Ending your account</h2>
      <p>You can stop using Anovibe at any time. To delete your account, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We may suspend or close accounts that break these terms.</p>
      <h2>Changes and contact</h2>
      <p>We may update these terms and will change the date above when we do. Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </LegalShell>
  );
}
