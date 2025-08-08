import { CheckCircle2, Calendar, Package, Clock } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-bg-alt  rounded-lg p-6 border border-gray-200 ">
      <h2 className="text-xl font-semibold text-text  mb-4">Szybkie akcje</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="flex flex-col items-center p-4 bg-blue-50  rounded-lg hover:bg-blue-100  transition-colors">
          <CheckCircle2 className="h-8 w-8 text-blue-600 mb-2" />
          <span className="text-sm font-medium text-text ">Nowe zadanie</span>
        </button>
        <button className="flex flex-col items-center p-4 bg-green-50  rounded-lg hover:bg-green-100  transition-colors">
          <Calendar className="h-8 w-8 text-green-600 mb-2" />
          <span className="text-sm font-medium text-text ">Dodaj wydarzenie</span>
        </button>
        <button className="flex flex-col items-center p-4 bg-purple-50  rounded-lg hover:bg-purple-100  transition-colors">
          <Package className="h-8 w-8 text-purple-600 mb-2" />
          <span className="text-sm font-medium text-text ">Lista zakupów</span>
        </button>
        <button className="flex flex-col items-center p-4 bg-yellow-50  rounded-lg hover:bg-yellow-100  transition-colors">
          <Clock className="h-8 w-8 text-yellow-600 mb-2" />
          <span className="text-sm font-medium text-text ">Nowa płatność</span>
        </button>
      </div>
    </div>
  );
}
