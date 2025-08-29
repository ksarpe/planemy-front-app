import { usePayments } from "@/hooks/payments";
import { PaymentInterface } from "@/data/Payments/interfaces";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  Trash2,
  Power,
  PowerOff,
  Calendar,
  DollarSign,
  Tag,
  AlertCircle,
} from "lucide-react";
import { getDaysUntilPayment, isPaymentPaidForCurrentPeriod } from "@/api/payments";

export default function PaymentItem({ payment }: { payment: PaymentInterface }) {
  const { markAsPaid, removePayment, togglePaymentStatus, updatePayment } = usePayments();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: payment.name,
    amount: payment.amount.toString(),
    description: payment.description || "",
  });

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const daysUntil = getDaysUntilPayment(payment.nextPaymentDate);
  const isOverdue = daysUntil < 0;
  const isDueSoon = daysUntil <= payment.reminderDays && daysUntil >= 0;
  const isPaidForCurrentPeriod = isPaymentPaidForCurrentPeriod(payment);

  const handleSaveEdit = async () => {
    try {
      await updatePayment(payment.id, {
        name: editData.name,
        amount: parseFloat(editData.amount),
        description: editData.description,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const getCategoryIcon = (category: PaymentInterface["category"]) => {
    switch (category) {
      case "subscription":
        return "📺";
      case "utility":
        return "⚡";
      case "insurance":
        return "🛡️";
      case "loan":
        return "🏦";
      case "rent":
        return "🏠";
      default:
        return "💳";
    }
  };

  const getCategoryColor = (category: PaymentInterface["category"]) => {
    switch (category) {
      case "subscription":
        return "bg-purple-100 text-purple-800";
      case "utility":
        return "bg-yellow-100 text-yellow-800";
      case "insurance":
        return "bg-blue-100 text-blue-800";
      case "loan":
        return "bg-red-100 text-red-800";
      case "rent":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = () => {
    if (!payment.isActive) return "bg-gray-100 border-gray-300";
    if (isPaidForCurrentPeriod) return "bg-green-50 border-green-200";
    if (isOverdue) return "bg-red-50 border-red-200";
    if (isDueSoon) return "bg-yellow-50 border-yellow-200";
    return "bg-white border-gray-200";
  };

  return (
    <li className={`rounded-md shadow-sm border-2 transition-all duration-200 ${getStatusColor()}`}>
      <div onClick={toggleExpand} className="flex justify-between items-center p-4 cursor-pointer hover:bg-opacity-80">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-2xl">{getCategoryIcon(payment.category)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-medium ${!payment.isActive ? "text-gray-500" : ""}`}>{payment.name}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(payment.category)}`}>
                {payment.category}
              </span>
              {!payment.isActive && (
                <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">Nieaktywna</span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <DollarSign size={14} />
                <span className="font-medium">
                  {payment.amount.toFixed(2)} {payment.currency}
                </span>
                <span>/ {payment.cycle}</span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {isOverdue ? (
                  <span className="text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle size={14} />
                    Przeterminowane ({Math.abs(daysUntil)} dni)
                  </span>
                ) : isDueSoon ? (
                  <span className="text-yellow-600 font-medium">Za {daysUntil} dni</span>
                ) : (
                  <span>Za {daysUntil} dni</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPaidForCurrentPeriod && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <Check size={16} />
              <span>Opłacone</span>
            </div>
          )}

          <button className="text-gray-600 hover:text-gray-800 transition-colors">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nazwa</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kwota</label>
                <input
                  type="number"
                  step="0.01"
                  value={editData.amount}
                  onChange={(e) => setEditData((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Opis</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors">
                  Zapisz
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      name: payment.name,
                      amount: payment.amount.toString(),
                      description: payment.description || "",
                    });
                  }}
                  className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors">
                  Anuluj
                </button>
              </div>
            </div>
          ) : (
            <>
              {payment.description && (
                <div className="text-sm text-gray-600">
                  <Tag size={14} className="inline mr-1" />
                  {payment.description}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Ostatnia płatność:</span>
                  <div>{payment.lastPaymentDate || "Brak"}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Następna płatność:</span>
                  <div>{new Date(payment.nextPaymentDate).toLocaleDateString("pl-PL")}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Przypomnienie:</span>
                  <div>{payment.reminderDays} dni wcześniej</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Auto-odnowienie:</span>
                  <div>{payment.autoRenew ? "Tak" : "Nie"}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {payment.isActive && !isPaidForCurrentPeriod && (
                  <button
                    onClick={() => markAsPaid(payment.id)}
                    className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors flex items-center gap-1">
                    <Check size={12} />
                    Oznacz jako opłacone
                  </button>
                )}

                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors">
                  Edytuj
                </button>

                <button
                  onClick={() => togglePaymentStatus(payment.id, !payment.isActive)}
                  className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                    payment.isActive
                      ? "bg-gray-500 text-white hover:bg-gray-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}>
                  {payment.isActive ? <PowerOff size={12} /> : <Power size={12} />}
                  {payment.isActive ? "Dezaktywuj" : "Aktywuj"}
                </button>

                <button
                  onClick={() => removePayment(payment.id)}
                  className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors flex items-center gap-1">
                  <Trash2 size={12} />
                  Usuń
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </li>
  );
}
