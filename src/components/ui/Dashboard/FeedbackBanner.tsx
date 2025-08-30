import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useT } from "@/hooks/useT";

export function FeedbackBanner() {
  const navigate = useNavigate();
  const { t } = useT();

  return (
    <div
      className="bg-orange-500 border border-orange-200 rounded-lg p-4 cursor-pointer"
      onClick={() => navigate("/feedback")}>
      <div className="flex items-center flex-col md:flex-row gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-orange-800 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text mb-1">{t("feedback.banner.title")}</h3>
          <p className="text-sm text-text">
            {t("feedback.banner.description")}
          </p>
          <p className="text-lg text-text">{t("feedback.banner.clickHere")}</p>
        </div>
      </div>
    </div>
  );
}
