import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Read the Terms and Conditions and community guidelines for joining the Youth Club of Mirzapur.",
  openGraph: {
    title: "Terms and Conditions | Youth Club of Mirzapur",
    description:
      "Read the Terms and Conditions and community guidelines for joining the Youth Club of Mirzapur.",
    url: "/terms",
  },
};

export default function TermsConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-4xl pt-32 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-foreground/80 leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the Youth Club of Mirzapur platform, you agree
            to be bound by these Terms and Conditions. If you do not agree with
            any part of these terms, you may not use our services or participate
            in club activities through the website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            2. Membership and Registration
          </h2>
          <p>
            Membership requires registration and subsequent approval from the
            club administrators. You agree to provide accurate, current, and
            complete information during registration. We reserve the right to
            suspend or terminate accounts that provide false information or
            violate our community guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            3. Code of Conduct
          </h2>
          <p>As a member of the Youth Club of Mirzapur, you are expected to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Always treat other members with respect and courtesy, both online
              and offline.
            </li>
            <li>
              Refrain from posting or sharing any inappropriate, offensive, or
              harmful material.
            </li>
            <li>
              Adhere strictly to the rules set by administrators for specific
              events and club activities.
            </li>
            <li>
              Promote unity and avoid actions that bring disrepute to the name
              of the club.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            4. Event RSVPs and Participation
          </h2>
          <p>
            By RSVPing to an event, you commit to attending and, if applicable,
            making the required payment or contribution on time. Continuous
            failure to honor RSVPs may result in restrictions on your ability to
            participate in future events.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            5. Modifications to Terms
          </h2>
          <p>
            We reserve the right to modify or replace these Terms at any time.
            Significant changes will be communicated to members. Your continued
            use of the platform following the posting of any changes constitutes
            acceptance of those changes.
          </p>
        </section>
      </div>
    </div>
  );
}
