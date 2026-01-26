export default function VoteDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      Vote Dashboard holds:
      {children}
    </div>
  );
}
