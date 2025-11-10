import { Award, BarChart3, Brain, Calendar, CheckCircle, Target, TrendingUp, Trophy, Zap } from "lucide-react";

export default function DevelopmentView() {
  // Placeholder data - będzie z API w przyszłości
  const stats = {
    level: 5,
    xp: 1250,
    xpToNext: 2000,
    streak: 7,
    completedTasks: 142,
    completedEvents: 38,
  };

  const achievements = [
    {
      id: 1,
      title: "Pierwszy krok",
      description: "Ukończono pierwsze zadanie",
      icon: Trophy,
      unlocked: true,
      date: "2025-11-01",
    },
    {
      id: 2,
      title: "Siedem dni",
      description: "7 dni z rzędu wykonanych zadań",
      icon: Award,
      unlocked: true,
      date: "2025-11-03",
    },
    {
      id: 3,
      title: "Mistrz czasu",
      description: "50 zadań ukończonych na czas",
      icon: Target,
      unlocked: false,
      progress: 32,
    },
    {
      id: 4,
      title: "Tydzień bez opóźnień",
      description: "Wszystkie płatności na czas przez tydzień",
      icon: CheckCircle,
      unlocked: false,
      progress: 5,
    },
  ];

  const skills = [
    { id: 1, name: "Produktywność", level: 3, maxLevel: 10, icon: Zap, color: "text-yellow-500" },
    { id: 2, name: "Organizacja", level: 4, maxLevel: 10, icon: Brain, color: "text-blue-500" },
    { id: 3, name: "Finanse", level: 2, maxLevel: 10, icon: TrendingUp, color: "text-green-500" },
    { id: 4, name: "Planowanie", level: 5, maxLevel: 10, icon: Calendar, color: "text-purple-500" },
  ];

  const recentActivity = [
    { id: 1, type: "task", title: "Ukończono zadanie: Zakupy", xp: 50, time: "2 godziny temu" },
    { id: 2, type: "achievement", title: "Odblokowano osiągnięcie: Siedem dni", xp: 100, time: "5 godzin temu" },
    { id: 3, type: "event", title: "Uczestniczono w: Spotkanie zespołu", xp: 25, time: "1 dzień temu" },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hide">
      <div className="mx-auto p-6 space-y-6">
        {/* Header - Twój Rozwój */}
        <div className="bg-bg-primary rounded-3xl p-8 border border-border shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-text text-2xl">Śledź swoje postępy i osiągnięcia</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="bg-bg-secondary border border-border px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold text-text">Poziom {stats.level}</span>
                </div>
                <div className="bg-bg-secondary border border-border px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold text-text">🔥 {stats.streak} dni z rzędu</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold text-text">{stats.level}</div>
              <div className="text-text-muted">Level</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-text-muted mb-2">
              <span>Postęp do kolejnego poziomu</span>
              <span>
                {stats.xp} / {stats.xpToNext} XP
              </span>
            </div>
            <div className="w-full bg-bg-muted-light rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.xp / stats.xpToNext) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-primary shadow-md shadow-shadow rounded-2xl p-6 border border-bg-muted-light">
            <div className="flex  items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Ukończone zadania</p>
                <p className="text-3xl font-bold text-text mt-1">{stats.completedTasks}</p>
              </div>
              <CheckCircle className="text-success" size={32} />
            </div>
          </div>

          <div className="bg-bg-primary shadow-md shadow-shadow rounded-2xl p-6 border border-bg-muted-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Wydarzenia</p>
                <p className="text-3xl font-bold text-text mt-1">{stats.completedEvents}</p>
              </div>
              <Calendar className="text-primary" size={32} />
            </div>
          </div>

          <div className="bg-bg-primary rounded-2xl p-6 border border-bg-muted-light shadow-md shadow-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Seria dni</p>
                <p className="text-3xl font-bold text-text mt-1">{stats.streak}</p>
              </div>
              <Zap className="text-yellow-500" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Osiągnięcia */}
          <div className="bg-bg-primary rounded-2xl p-6 border border-bg-muted-light shadow-md shadow-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text">Osiągnięcia</h2>
              <Trophy className="text-yellow-500" size={24} />
            </div>
            <div className="space-y-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border transition-all ${
                      achievement.unlocked
                        ? "bg-bg-primary border-yellow-500/30"
                        : "bg-bg-secondary border-bg-muted-light opacity-60"
                    }`}>
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${achievement.unlocked ? "bg-yellow-500/20" : "bg-bg-muted-light"}`}>
                        <Icon className={achievement.unlocked ? "text-yellow-500" : "text-text-muted"} size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-text">{achievement.title}</h3>
                          {achievement.unlocked && (
                            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                              ✓ Odblokowane
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-muted mt-1">{achievement.description}</p>
                        {!achievement.unlocked && achievement.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-text-muted mb-1">
                              <span>Postęp</span>
                              <span>{achievement.progress}/50</span>
                            </div>
                            <div className="w-full bg-bg-muted-light rounded-full h-2">
                              <div
                                className="bg-primary h-full rounded-full transition-all"
                                style={{ width: `${(achievement.progress / 50) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {achievement.unlocked && achievement.date && (
                          <p className="text-xs text-text-muted mt-1">{achievement.date}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drzewko umiejętności */}
          <div className="bg-bg-primary rounded-2xl p-6 border border-bg-muted-light shadow-md shadow-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text">Umiejętności</h2>
              <Brain className="text-purple-500" size={24} />
            </div>
            <div className="space-y-4">
              {skills.map((skill) => {
                const Icon = skill.icon;
                const progress = (skill.level / skill.maxLevel) * 100;
                return (
                  <div key={skill.id} className="p-4 bg-bg-secondary rounded-xl border border-bg-muted-light">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-bg-primary rounded-lg">
                        <Icon className={skill.color} size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-text">{skill.name}</h3>
                          <span className="text-sm text-text-muted">
                            Lvl {skill.level}/{skill.maxLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-bg-muted-light rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all ${skill.color.replace("text-", "bg-")}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-4 bg-bg-primary rounded-xl border border-border">
              <p className="text-sm text-text-muted">
                💡 <span className="font-semibold text-text">Wskazówka:</span> Rozwijaj umiejętności wykonując zadania,
                uczestnicząc w wydarzeniach i osiągając cele!
              </p>
            </div>
          </div>
        </div>

        {/* Ostatnia aktywność i wykresy placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ostatnia aktywność */}
          <div className="bg-bg-primary rounded-2xl p-6 border border-bg-muted-light shadow-md shadow-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text">Ostatnia aktywność</h2>
              <TrendingUp className="text-primary" size={24} />
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-bg-secondary rounded-xl border border-bg-muted-light">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text">{activity.title}</p>
                    <p className="text-xs text-text-muted">{activity.time}</p>
                  </div>
                  <div className="text-success font-semibold text-sm">+{activity.xp} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* Wykresy - placeholder */}
          <div className="bg-bg-primary rounded-2xl p-6 border border-bg-muted-light shadow-md shadow-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text">Statystyki</h2>
              <BarChart3 className="text-blue-500" size={24} />
            </div>
            <div className="h-64 flex items-center justify-center bg-bg-secondary rounded-xl border border-bg-muted-light border-dashed">
              <div className="text-center">
                <BarChart3 className="text-text-muted mx-auto mb-2" size={48} />
                <p className="text-text-muted">Wykresy postępów</p>
                <p className="text-xs text-text-muted mt-1">Wkrótce dostępne</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
