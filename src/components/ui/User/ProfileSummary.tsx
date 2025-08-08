import type { UserBasicInfo } from "@/data/User";

interface ProfileSummaryProps {
  userInfo: UserBasicInfo;
  language: string;
  timezone: string;
  themeName: string;
  notifications: { email: boolean; push: boolean; tasks: boolean; events: boolean; sharing: boolean };
}

export default function ProfileSummary({
  userInfo,
  language,
  timezone,
  themeName,
  notifications,
}: ProfileSummaryProps) {
  const notifLabels: Array<{ key: keyof typeof notifications; label: string }> = [
    { key: "email", label: "Email" },
    { key: "push", label: "Push" },
    { key: "tasks", label: "Zadania" },
    { key: "events", label: "Wydarzenia" },
    { key: "sharing", label: "Udostępnianie" },
  ];

  return (
    <div className="bg-white  rounded-lg p-6 border border-gray-200 ">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 ">Podsumowanie profilu</h2>
        <p className="text-sm text-gray-600 ">Szybki przegląd Twoich ustawień</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryItem label="Pseudonim" value={userInfo.nickname || "—"} />
        <SummaryItem label="Email" value={userInfo.email || "—"} />
        <SummaryItem label="Język" value={language} />
        <SummaryItem label="Strefa czasowa" value={timezone} />
        <SummaryItem label="Motyw" value={themeName} />
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-gray-500  mb-2">Powiadomienia</span>
          <div className="flex flex-wrap gap-2">
            {notifLabels.map(({ key, label }) => (
              <span
                key={key}
                className={
                  notifications[key]
                    ? "px-2 py-1 text-xs rounded-full bg-green-100 text-green-700  "
                    : "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700  "
                }>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-gray-500  mb-2">{label}</span>
      <span className="text-sm font-medium text-gray-900  truncate">{value}</span>
    </div>
  );
}
