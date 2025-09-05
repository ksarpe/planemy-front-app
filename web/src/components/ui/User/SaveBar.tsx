import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "@shared/hooks/useT";
import type { SaveBarProps } from "@/data/User/Components/UserComponentInterfaces";

export default function SaveBar({ visible, onSave, onDiscard, ping = 0 }: SaveBarProps) {
  const [flash, setFlash] = useState(false);
  const { t } = useT();

  useEffect(() => {
    if (!visible) return;
    // Trigger a short flash + bounce when ping changes
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 700);
    return () => clearTimeout(t);
  }, [ping, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center">
      <div
        className={[
          "bg-white  border border-gray-200  shadow-lg rounded-full px-3 py-2 flex items-center gap-2 transition-all",
          flash ? "ring-2 ring-red-500/70 animate-bounce" : "",
        ].join(" ")}>
        <button
          onClick={onDiscard}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300  text-gray-700  hover:bg-gray-50  transition-colors"
          title={t("profile.discardChanges")}>
          <X size={16} />
          {t("profile.discard")}
        </button>
        <button
          onClick={onSave}
          className={[
            "flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors",
            "animate-bounce",
            flash ? "ring-2 ring-red-500/70" : "",
          ].join(" ")}
          title={t("profile.saveChanges")}>
          <Save size={16} />
          {t("common.save")}
        </button>
      </div>
    </div>
  );
}
