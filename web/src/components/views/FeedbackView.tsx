import { useState } from "react";
import { Send, MessageCircle, Clock, CheckCircle, Users, Wrench } from "lucide-react";
import { useFeedback } from "@shared/hooks/feedback/useFeedback";
import { useT } from "@shared/hooks/utils/useT";

export default function FeedbackView() {
  const [message, setMessage] = useState("");
  const { createFeedback, isCreating, publicFeedbacks, isLoadingPublic } = useFeedback();
  const { t } = useT();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    createFeedback({ message: message.trim() });
    setMessage("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "accepted":
        return <Wrench className="w-4 h-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t("feedback.status.pending");
      case "accepted":
        return t("feedback.status.accepted");
      case "resolved":
        return t("feedback.status.resolved");
      default:
        return t("feedback.status.unknown");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto overflow-auto scrollbar-hide">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">{t("feedback.title")}</h1>
        <p className="text-text-secondary">{t("feedback.subtitle")}</p>
      </div>

      {/* Formularz wysyłania feedbacku */}
      <div className="bg-white rounded-lg shadow-md border border-border p-6 mb-8">
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-orange-500" />
          {t("feedback.sendFeedback")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
              {t("feedback.yourMessage")}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("feedback.messagePlaceholder")}
              className="w-full h-32 px-3 py-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <p className="text-xs text-text-secondary mt-1">{t("feedback.minimumCharacters")}</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating || message.trim().length < 10}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("feedback.sending")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t("feedback.sendFeedback")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Publiczne zgłoszenia - roadmap */}
      <div className="bg-white rounded-lg shadow-md border border-border p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          {t("feedback.roadmapTitle")}
        </h2>
        <p className="text-text-secondary text-sm mb-6">{t("feedback.seeWhatWeAreWorking")}</p>

        {isLoadingPublic ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : publicFeedbacks.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t("feedback.noPublicFeedback")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {publicFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className={`border rounded-lg p-4 transition-all ${
                  feedback.status === "resolved" ? "border-green-200 bg-green-50/50" : "border-blue-200 bg-blue-50/50"
                }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(feedback.status || "pending")}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusBadgeColor(
                        feedback.status || "pending",
                      )}`}>
                      {getStatusText(feedback.status || "pending")}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {feedback.createdAt.toLocaleDateString("pl-PL", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-text-primary leading-relaxed font-medium mb-1">{feedback.message}</p>
                {feedback.status === "resolved" && (
                  <div className="mt-3 flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">{t("feedback.featureImplemented")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
