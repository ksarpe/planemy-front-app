import { useNavigate } from "react-router-dom";
import { useT } from "@shared/hooks/utils/useT";

export function FeedbackBanner() {
  const navigate = useNavigate();
  const { t } = useT();

  return (
    <div className="bg-bg rounded-lg p-4 cursor-pointer" onClick={() => navigate("/feedback")}>
      <div className="flex items-center flex-col md:flex-row gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-orange-800 text-white font-bold text-2xl rounded-lg flex items-center justify-center">
            !
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-text">{t("feedback.banner.title")}</h4>
        </div>
      </div>
    </div>
  );
}
