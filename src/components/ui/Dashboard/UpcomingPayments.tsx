import { usePaymentsContext } from "@/hooks/context/usePaymentsContext";
import { Package, ChevronRight } from "lucide-react";
import { differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function UpcomingPayments() {
  const { payments } = usePaymentsContext();
  const navigate = useNavigate();

  // Filter active payments and calculate days left
  const upcomingPayments = payments
    .filter((payment) => payment.isActive)
    .map((payment) => ({
      ...payment,
      daysLeft: differenceInDays(new Date(payment.nextPaymentDate), new Date()),
    }))
    .filter((payment) => payment.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="bg-bg-alt  rounded-lg p-6 border border-gray-200 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text  flex items-center">
          <Package className="h-5 w-5 mr-2 text-primary" />
          Nadchodzące płatności
          {upcomingPayments.length > 0 && (
            <span className="ml-2 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
              {upcomingPayments.length}
            </span>
          )}
        </h2>
        <button
          onClick={() => navigate("/payments")}
          className="text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/10 transition-colors">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-3">
        {upcomingPayments.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Brak nadchodzących płatności</p>
          </div>
        ) : (
          upcomingPayments.slice(0, 5).map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 bg-bg  rounded-lg">
              <div>
                <p className="text-sm font-medium text-text ">{payment.name}</p>
                <p className="text-xs text-gray-500 ">
                  {payment.daysLeft === 0 ? "Dzisiaj" : payment.daysLeft === 1 ? "Jutro" : `Za ${payment.daysLeft} dni`}{" "}
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
                  {payment.daysLeft <= 3 ? "Pilne" : payment.daysLeft <= 7 ? "Wkrótce" : "OK"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate("/payments")}
          className="w-full text-center py-2 text-sm text-primary hover:text-primary/80 font-medium">
          Zobacz wszystkie płatności
        </button>
      </div>
    </div>
  );
}
