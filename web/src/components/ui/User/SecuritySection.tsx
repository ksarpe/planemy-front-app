import { useT } from "@shared/hooks/utils/useT";

export default function SecuritySection() {
  const { t } = useT();

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center flex-wrap">
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          {t("security.changePassword")}
        </button>
        <button className="px-4 py-2 bg-bg-alt text-text rounded-lg hover:bg-bg-muted-light transition-colors border border-bg-muted-light">
          {t("security.setup2FA")}
        </button>
        <button className="px-4 py-2 border border-negative/30 text-negative rounded-lg hover:bg-negative/10 transition-colors">
          {t("security.deleteAccount")}
        </button>
      </div>
    </div>
  );
}
