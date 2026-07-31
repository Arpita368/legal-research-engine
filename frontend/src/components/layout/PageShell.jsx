export function PageShell({ title, eyebrow, actions, children }) {
  return (
    <section className="h-full overflow-y-auto">
      <div className="mx-auto grid max-w-7xl gap-5 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {eyebrow}
            </p>
            <h1 className="mt-1 text-3xl font-semibold">{title}</h1>
          </div>
          {actions ? (
            <div className="flex flex-wrap gap-2">{actions}</div>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
