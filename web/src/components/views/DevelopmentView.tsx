import { TrendingUp, Target, BookOpen, Lightbulb } from "lucide-react";
import { useT } from "@shared/hooks/utils/useT";

export default function DevelopmentView() {
  const { t } = useT();

  return (
    <div className="h-full overflow-auto scrollbar-hide">
      <div className="p-4 space-y-6 bg-bg min-h-full">
        {/* Header */}
        <div className="flex items-center gap-3">
          <TrendingUp size={32} className="text-primary" />
          <h1 className="text-2xl font-bold text-text">{t("sidebar.development")}</h1>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-bg-alt rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Lightbulb size={32} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-text">Wkrótce...</h2>
            <p className="text-text-light">Ta sekcja będzie zawierać narzędzia do rozwoju osobistego i zawodowego.</p>
          </div>
        </div>

        {/* Placeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-bg-alt rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Target size={24} className="text-primary" />
              <h3 className="font-semibold text-text">Cele</h3>
            </div>
            <p className="text-sm text-text-light">Ustaw i śledź swoje cele osobiste i zawodowe.</p>
          </div>

          <div className="bg-bg-alt rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-primary" />
              <h3 className="font-semibold text-text">Nauka</h3>
            </div>
            <p className="text-sm text-text-light">Zarządzaj procesem uczenia się i rozwijania umiejętności.</p>
          </div>

          <div className="bg-bg-alt rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="text-primary" />
              <h3 className="font-semibold text-text">Progres</h3>
            </div>
            <p className="text-sm text-text-light">Śledź swój rozwój i postępy w różnych obszarach.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
