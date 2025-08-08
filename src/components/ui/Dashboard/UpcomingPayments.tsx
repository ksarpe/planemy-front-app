import { Package } from "lucide-react";

interface Payment {
  id: number;
  name: string;
  amount: number;
  daysLeft: number;
}

interface UpcomingPaymentsProps {
  payments: Payment[];
}

export default function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
  return (
    <div className="bg-bg-alt  rounded-lg p-6 border border-gray-200 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text  flex items-center">
          <Package className="h-5 w-5 mr-2 text-purple-600" />
          Nadchodzące płatności
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-800  ">Zarządzaj</button>
      </div>
      <div className="space-y-3">
        {payments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-3 bg-bg  rounded-lg">
            <div>
              <p className="text-sm font-medium text-text ">{payment.name}</p>
              <p className="text-xs text-gray-500 ">Za {payment.daysLeft} dni</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-text ">{payment.amount.toFixed(2)} zł</p>
              <p
                className={`text-xs ${
                  payment.daysLeft <= 3 ? "text-red-500" : payment.daysLeft <= 7 ? "text-yellow-500" : "text-green-500"
                }`}>
                {payment.daysLeft <= 3 ? "Pilne" : payment.daysLeft <= 7 ? "Wkrótce" : "OK"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
