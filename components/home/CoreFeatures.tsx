const PullOfHomeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Map pin with a house inside */}
    <path d="M12 22C8.5 18.2 4 13.5 4 9.5a8 8 0 1 1 16 0c0 4-4.5 8.7-8 12.5z" />
    <path d="M12 6l-3 2.5V12h6V8.5L12 6z" />
    <path d="M11 12V9.5h2V12" />
  </svg>
);

const OpenLedgerIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Open book / ledger with a community connection symbol */}
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    <circle cx="16" cy="9" r="2" />
    <path d="M13.5 14c0-1.4 1.1-2.5 2.5-2.5h0c1.4 0 2.5 1.1 2.5 2.5" />
    <path d="M6 8h2" />
    <path d="M6 12h2" />
  </svg>
);

const MemoriesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Stacked polaroids / photos */}
    <rect
      x="3"
      y="3"
      width="16"
      height="16"
      rx="2"
      ry="2"
      strokeDasharray="4 4"
      className="opacity-60"
    />
    <rect
      x="7"
      y="7"
      width="14"
      height="14"
      rx="2"
      ry="2"
      className="bg-background"
    />
    <path d="M7 16l4-4 3 3" />
    <path d="M12 15l2-2 4 4" />
    <circle cx="11.5" cy="11.5" r="1.5" fill="currentColor" />
  </svg>
);

export function CoreFeatures() {
  const features = [
    {
      title: "The Pull of Home",
      icon: <PullOfHomeIcon className="h-8 w-8 text-primary" />,
      description:
        "Careers may scatter us across cities, but Mirzapur will always be our anchor. Let's effortlessly organize our grand returns.",
      bg: "bg-primary/5",
    },
    {
      title: "Collective Strength, Shared Trust",
      icon: <OpenLedgerIcon className="h-8 w-8 text-secondary" />,
      description:
        "Distance shouldn't breed doubt. We maintain complete visibility over our shared resources and club decisions, so every brother stays connected to how we build our community.",
      bg: "bg-secondary/5",
    },
    {
      title: "Beyond the Group Chat",
      icon: <MemoriesIcon className="h-8 w-8 text-accent" />,
      description:
        "Messenger threads get lost, but legends shouldn't. This is our permanent vault for the golden moments, the laughter, and the history we are writing together.",
      bg: "bg-accent/5",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            What We Do
          </h2>
          <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-lg hover:-translate-y-2 hover:border-primary/20"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:-rotate-3 ${feature.bg}`}
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative edge line over hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 bg-linear-to-r from-primary to-accent transition-all group-hover:w-1/2 rounded-t-full opacity-0 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
