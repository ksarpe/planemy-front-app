import { usePreferencesContext } from "@/context/PreferencesContext";
import { useState } from "react";

import { dayStartOptions } from "@/data/data";

export default function ProfileView() {
  const { dayStartTime, setDayStartTime, isDark, toggleTheme } = usePreferencesContext();
  const [username, setUsername] = useState("Kasper Janowski");
  const [email, setEmail] = useState("2299kasper@gmail.com");

  return (
    <div className="p-8 max-w-2xl text-black dark:text-white">
      <section className="space-y-4 mb-8">
        <h3 className="font-semibold text-lg">🪪 Personal Info</h3>
        <div className="flex flex-col gap-2">
          <label className="text-sm">Name</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="space-y-4 mb-8">
        <h3 className="font-semibold text-lg">🎨 Planora preferences</h3>

        <div className="flex items-center gap-3">
          <span className="text-sm">Dark Mode</span>
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm">Day start time</span>
          <select
            value={dayStartTime}
            onChange={(e) => setDayStartTime(e.target.value)}
            className="rounded-full border border-primary px-3 py-1 bg-white dark:bg-gray-800 text-sm">
            {dayStartOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <button className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 text-sm">💾 Save Changes</button>
    </div>
  );
}
