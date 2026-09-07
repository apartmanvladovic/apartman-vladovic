interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`mb-12 max-w-2xl ${alignClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-light leading-tight tracking-tight text-pine-700 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-relaxed text-pine-950/70">{description}</p>
      )}
    </div>
  );
}
