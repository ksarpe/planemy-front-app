import { usePaymentsContext } from "@shared/hooks/context/usePaymentsContext";
import { Package } from "lucide-react";
import { differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { isPaymentPaidForCurrentPeriod } from "@shared/api/payments";
import { useT } from "@shared/hooks/useT";

export default function UpcomingPayments() {
  const { payments } = usePaymentsContext();
  const navigate = useNavigate();
  const { t } = useT();

  // Filter payments and calculate days left
  const upcomingPayments = payments
    .filter((payment) => !isPaymentPaidForCurrentPeriod(payment))
    .map((payment) => ({
      ...payment,
      daysLeft: differenceInDays(new Date(payment.nextPaymentDate), new Date()),
    }))
    .filter((payment) => payment.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="bg-bg  rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text  flex items-center">
          {t("dashboard.upcomingPayments")}
          {upcomingPayments.length > 0 && (
            <span className="ml-2 bg-primary-light text-primary text-sm font-bold px-2 py-1 rounded-full">
              {upcomingPayments.length}
            </span>
          )}
        </h2>
        <p className="text-xs text-primary cursor-pointer " onClick={() => navigate("/payments")}>
          Przejdź do płatności
        </p>
      </div>
      <div className="space-y-3">
        {upcomingPayments.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t("noUpcomingPayments")}</p>
          </div>
        ) : (
          upcomingPayments.slice(0, 5).map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 bg-bg-alt  rounded-md">
              <div>
                <p className="text-sm font-medium text-text ">{payment.name}</p>
                <p className="text-xs text-gray-500 ">
                  {payment.daysLeft === 0
                    ? t("today")
                    : payment.daysLeft === 1
                    ? t("tomorrow")
                    : t("dashboard.inDays", { count: payment.daysLeft })}{" "}
                  • {payment.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-text ">
                  {payment.amount.toFixed(2)} {payment.currency}
                </p>
                <p
                  className={`text-xs ${
                    payment.daysLeft <= 3
                      ? "text-red-500"
                      : payment.daysLeft <= 7
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}>
                  {payment.daysLeft <= 3
                    ? t("dashboard.urgent")
                    : payment.daysLeft <= 7
                    ? t("dashboard.soon")
                    : t("payments.item.paid")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
