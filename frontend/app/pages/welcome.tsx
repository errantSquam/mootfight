
export function Welcome() {
  return (
    <div className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="flex flex-col items-center gap-9 text-xl">
          Welcome to Mootfight!
        </div>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
              Placeholder Bottom Text
            </p>
          </nav>
        </div>
      </div>
    </div>
  );
}