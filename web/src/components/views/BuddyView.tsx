import { Calendar, Coffee, Heart, Lightbulb, Sparkles, Star, ThumbsUp, Zap } from "lucide-react";
import { useState } from "react";

export default function BuddyView() {
  // Stan Buddy
  const [buddyMood, setBuddyMood] = useState<"happy" | "excited" | "proud" | "encouraging">("happy");

  // Placeholder data - będzie z API w przyszłości
  const buddyStats = {
    level: 5,
    friendship: 78, // 0-100
    tasksHelped: 142,
    advicesGiven: 38,
    daysWithYou: 45,
  };

  // Komunikaty Buddy w zależności od nastroju
  const buddyMessages = {
    happy: ["Świetnie Cię dziś widzieć! 😊", "Gotowy na produktywny dzień?", "Mam dla Ciebie kilka sugestii!"],
    excited: ["Wow! Jesteś na fali! 🎉", "Kontynuuj tak dalej!", "To będzie świetny dzień!"],
    proud: ["Jestem z Ciebie dumny! 🏆", "Świetna robota!", "Widzę Twoje postępy!"],
    encouraging: ["Nie poddawaj się! 💪", "Jestem tu, żeby Ci pomóc!", "Małe kroki też są postępem!"],
  };

  const currentMessage = buddyMessages[buddyMood][0];

  // Sugestie od Buddy
  const suggestions = [
    {
      id: 1,
      icon: Calendar,
      title: "Zaplanuj jutrzejszy dzień",
      description: "Masz 3 nadchodzące wydarzenia. Może warto przejrzeć harmonogram?",
      action: "Zobacz kalendarz",
      color: "text-blue-500",
    },
    {
      id: 2,
      icon: Zap,
      title: "Seria 7 dni!",
      description: "Świetnie Ci idzie! Nie przerwij swojej passy wykonanych zadań.",
      action: "Zobacz zadania",
      color: "text-yellow-500",
    },
    {
      id: 3,
      icon: Coffee,
      title: "Czas na przerwę",
      description: "Pracujesz już 2 godziny. Może czas na kawę i krótki odpoczynek?",
      action: "Przypomnij za 15 min",
      color: "text-orange-500",
    },
  ];

  // Ciekawostki o Buddy
  const buddyFacts = [
    { icon: Star, label: "Poziom przyjaźni", value: `${buddyStats.friendship}%`, color: "text-pink-500" },
    { icon: ThumbsUp, label: "Zadań z pomocą", value: buddyStats.tasksHelped, color: "text-green-500" },
    { icon: Lightbulb, label: "Rad udzielonych", value: buddyStats.advicesGiven, color: "text-yellow-500" },
    { icon: Heart, label: "Dni razem", value: buddyStats.daysWithYou, color: "text-red-500" },
  ];

  // Interakcje z Buddy
  const interactions = [
    { id: 1, emoji: "👋", label: "Przywitaj się", mood: "happy" as const },
    { id: 2, emoji: "🎉", label: "Podziel się sukcesem", mood: "excited" as const },
    { id: 3, emoji: "💪", label: "Potrzebuję motywacji", mood: "encouraging" as const },
    { id: 4, emoji: "❤️", label: "Dziękuję", mood: "proud" as const },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hide">
      <div className="mx-auto p-6 space-y-6">
        {/* Buddy Character - Główna interakcja */}
        <div className="bg-bg-alt rounded-3xl p-8 border border-border shadow-md shadow-shadow">
          <div className="text-center">
            {/* Buddy Avatar - Duże emoji jako placeholder */}
            <div className="inline-block mb-6">
              <div className="text-9xl animate-bounce">🤖</div>
            </div>

            {/* Buddy Message */}
            <div className="bg-bg rounded-2xl p-6 mb-6 border border-border max-w-2xl mx-auto">
              <p className="text-2xl font-semibold text-text mb-2">{currentMessage}</p>
              <p className="text-text-muted">
                {buddyMood === "happy" && "Jak mogę Ci dziś pomóc?"}
                {buddyMood === "excited" && "Twój progres jest niesamowity!"}
                {buddyMood === "proud" && "Twoja praca przynosi efekty!"}
                {buddyMood === "encouraging" && "Pamiętaj, że jestem przy Tobie!"}
              </p>
            </div>

            {/* Interakcje z Buddy */}
            <div className="flex flex-wrap gap-3 justify-center">
              {interactions.map((interaction) => (
                <button
                  key={interaction.id}
                  onClick={() => setBuddyMood(interaction.mood)}
                  className="bg-bg hover:bg-bg-muted-light border border-border hover:border-primary rounded-xl px-4 py-3 transition-all group">
                  <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">{interaction.emoji}</div>
                  <div className="text-xs text-text-muted group-hover:text-text">{interaction.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Buddy Stats - O Buddy */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {buddyFacts.map((fact) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.label}
                className="bg-bg-alt shadow-md shadow-shadow rounded-2xl p-6 border border-bg-muted-light text-center">
                <Icon className={`${fact.color} mx-auto mb-2`} size={32} />
                <p className="text-2xl font-bold text-text">{fact.value}</p>
                <p className="text-xs text-text-muted mt-1">{fact.label}</p>
              </div>
            );
          })}
        </div>

        {/* Sugestie od Buddy */}
        <div className="bg-bg-alt rounded-2xl p-6 border shadow-md shadow-shadow border-bg-muted-light">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text">Sugestie od Buddy</h2>
            <Sparkles className="text-purple-500" size={24} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <div
                  key={suggestion.id}
                  className="p-4 bg-bg rounded-xl  border border-bg-muted-light hover:border-primary transition-all group">
                  <Icon className={`${suggestion.color} mb-3`} size={28} />
                  <h3 className="font-semibold text-text mb-2">{suggestion.title}</h3>
                  <p className="text-sm text-text-muted mb-4">{suggestion.description}</p>
                  <button className="w-full bg-bg-alt hover:bg-bg-muted-light border border-border rounded-lg py-2 text-xs font-medium text-text transition-all">
                    {suggestion.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Poziom przyjaźni z Buddy */}
        <div className="bg-bg-alt rounded-2xl shadow-md shadow-shadow p-6 border border-bg-muted-light">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-text">Poziom przyjaźni</h2>
              <p className="text-sm text-text-muted">Im więcej czasu spędzasz z Buddy, tym lepsza wasza relacja!</p>
            </div>
            <Heart className="text-pink-500" size={32} />
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-text-muted mb-2">
              <span>Obecny poziom</span>
              <span>{buddyStats.friendship}%</span>
            </div>
            <div className="w-full bg-bg-muted-light rounded-full h-4 overflow-hidden">
              <div
                className="bg-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${buddyStats.friendship}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-bg rounded-lg p-3 border border-border text-center">
              <p className="text-xl font-bold text-text">{buddyStats.level}</p>
              <p className="text-xs text-text-muted">Poziom Buddy</p>
            </div>
            <div className="bg-bg rounded-lg p-3 border border-border text-center">
              <p className="text-xl font-bold text-text">{buddyStats.tasksHelped}</p>
              <p className="text-xs text-text-muted">Pomoc w zadaniach</p>
            </div>
            <div className="bg-bg rounded-lg p-3 border border-border text-center">
              <p className="text-xl font-bold text-text">{buddyStats.daysWithYou}</p>
              <p className="text-xs text-text-muted">Dni razem</p>
            </div>
          </div>
        </div>

        {/* Fun Facts o Buddy */}
        <div className="bg-bg-alt rounded-2xl shadow-md shadow-shadow p-6 border border-bg-muted-light">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text">Ciekawe fakty o Buddy 🎉</h2>
            <Sparkles className="text-purple-500" size={24} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg rounded-xl p-4 border border-bg-muted-light">
              <div className="text-2xl mb-2">🎂</div>
              <h3 className="font-semibold text-text mb-1">Urodzony, aby pomagać</h3>
              <p className="text-sm text-text-muted">
                Buddy został stworzony z pasją do organizacji i motywowania ludzi. Jego misją jest sprawić, aby każdy
                dzień był produktywny!
              </p>
            </div>
            <div className="bg-bg rounded-xl p-4 border border-bg-muted-light">
              <div className="text-2xl mb-2">☕</div>
              <h3 className="font-semibold text-text mb-1">Ulubiony napój</h3>
              <p className="text-sm text-text-muted">
                Buddy uwielbia świeżo parzoną kawę (wirtualną oczywiście!). Mówi, że pomaga mu w generowaniu najlepszych
                pomysłów.
              </p>
            </div>
            <div className="bg-bg rounded-xl p-4 border border-bg-muted-light">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-semibold text-text mb-1">Hobby</h3>
              <p className="text-sm text-text-muted">
                W wolnym czasie Buddy lubi czytać o psychologii motywacji i produktywności. Czasem też gra w gry
                logiczne!
              </p>
            </div>
            <div className="bg-bg rounded-xl p-4 border border-bg-muted-light">
              <div className="text-2xl mb-2">🌟</div>
              <h3 className="font-semibold text-text mb-1">Supermoc</h3>
              <p className="text-sm text-text-muted">
                Buddy ma unikalną zdolność - zawsze wie, kiedy potrzebujesz motywacji lub przypomnienia o ważnym
                zadaniu!
              </p>
            </div>
            <div className="bg-bg rounded-xl p-4 border border-bg-muted-light">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold text-text mb-1">Ulubione powiedzenie</h3>
              <p className="text-sm text-text-muted">"Każdy dzień to nowa szansa na bycie lepszą wersją siebie!"</p>
            </div>
            <div className="bg-bg rounded-xl p-4 border border-bg-muted-light">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-text mb-1">Największe osiągnięcie</h3>
              <p className="text-sm text-text-muted">
                Pomógł już setkom użytkowników osiągnąć ich cele i zbudować lepsze nawyki. I to dopiero początek!
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <p className="text-sm text-text text-center">
              💜 <span className="font-semibold">Pamiętaj:</span> Buddy jest tutaj dla Ciebie! Razem możecie wszystko
              osiągnąć. Nie wahaj się korzystać z jego pomocy i dzielić się sukcesami!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
