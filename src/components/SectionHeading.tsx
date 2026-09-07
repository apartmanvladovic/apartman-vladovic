interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-forest-800 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-forest-950/70">{description}</p>
      )}
    </div>
  );
}
