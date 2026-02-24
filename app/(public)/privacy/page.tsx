import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy of the Youth Club of Mirzapur to understand how we collect and protect your data.",
  openGraph: {
    title: "Privacy Policy | Youth Club of Mirzapur",
    description:
      "Read the Privacy Policy of the Youth Club of Mirzapur to understand how we collect and protect your data.",
    url: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-4xl pt-32 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-foreground/80 leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            1. Information We Collect
          </h2>
          <p>
            When you register with the Youth Club of Mirzapur, we collect
            personal information that you provide to us, such as your name,
            email address, phone number, and any other details you choose to
            share in your profile.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            2. How We Use Your Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Provide, operate, and maintain our club platform and services.
            </li>
            <li>
              Process your registrations, event RSVPs, and membership approvals.
            </li>
            <li>
              Communicate with you regarding club events, news, updates, and
              administrative messages.
            </li>
            <li>
              Maintain a secure and authentic directory of approved club
              members.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            3. Data Security and Sharing
          </h2>
          <p>
            We implement reasonable security measures to protect your personal
            information. We do not sell, trade, or rent your personal
            identification information to outside parties. Your information may
            only be shared with club administrators to verify your identity and
            manage operations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            4. Cookies and Tracking
          </h2>
          <p>
            Our website utilizes cookies and similar tracking technologies to
            enhance your experience, maintain active login sessions, and
            understand how community members interact with our platform. You can
            instruct your browser to refuse all cookies or to indicate when a
            cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            5. Contact Us
          </h2>
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please contact the club administrators directly through our official
            Messenger group or via email at admin@youthclubofmirzapur.com
            (placeholder).
          </p>
        </section>
      </div>
    </div>
  );
}
