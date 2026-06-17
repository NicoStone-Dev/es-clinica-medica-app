export default function AppointmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-[radial-gradient(45.07%_45.07%_at_50.09%_54.93%,var(--color-blue-gray-200,#DCE9FF)_0%,#FFF_100%)]
      flex flex-col h-screen w-full px-10 py-6 gap-8 
    "
    >
      <div className="gap-0">
        <h1 className="text-primary font-semibold text-heading">Nova Consulta</h1>
        <p className="text-blue-gray-400 font-regular text-body">Fluxo de criação de consultas e fichamento de novos pacientes</p>
      </div>
      <div>
        time-line-tracker
      </div>
      {children}
    </div>
  );
}
