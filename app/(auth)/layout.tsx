export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="h-fit w-full bg-white rounded-2xl shadow-2xl">
        {children}
      </div>
    </div>
  );
}
