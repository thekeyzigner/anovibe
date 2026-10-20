import LegalShell from "@/components/LegalShell";
import { CONTACT_EMAIL } from "@/lib/site";

const QA: [string, string][] = [
  ["Is it really anonymous?", "Senders don't sign in or give a name, and you never see who sent a message. To limit spam and make blocking work, we keep a salted, hashed code based on the sender's network address and a cookie. It isn't shown to you or anyone else."],
  ["How do people message me?", "Share your link or your QR code. Both open the same page, where anyone can write you a message without an account."],
  ["Can I reply?", "Yes. Replies appear on your public page under the original message. The sender isn't notified, because we don't know who they are."],
  ["What if I get a rude message?", "Delete it, report it, or block the sender. Blocking removes their existing messages and stops new ones, and they won't be told."],
  ["Can I change my link?", "Yes. Change your username in Settings. Your old link stops working."],
  ["Can I change how my page looks?", "Yes. Pick a theme and write a bio in Settings. They show on your public page."],
  ["Who can use Anovibe?", "You need to be 13 or older."],
  ["How do I delete my account?", `Email us at ${CONTACT_EMAIL} from your account email and we'll delete your account and messages.`],
];

export default function FAQ() {
  return (
    <LegalShell title="Frequently asked questions">
      <div className="divide-y divide-navy/10">
        {QA.map(([q, a]) => (
          <details key={q} className="group py-4">
            <summary className="cursor-pointer list-none font-bold">{q}</summary>
            <p className="mt-2 text-slate">{a}</p>
          </details>
        ))}
      </div>
    </LegalShell>
  );
}
