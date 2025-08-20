import type { CategoryEmojiProps } from "@/data/Shopping/UI/CommonInterfaces";

export function CategoryEmoji({ category }: CategoryEmojiProps) {
  const getCategoryEmoji = (category: string) => {
    const categoryMap: Record<string, string> = {
      "Owoce i warzywa": "🥕",
      "Mięso i ryby": "🥩",
      Nabiał: "🥛",
      Pieczywo: "🍞",
      Napoje: "🥤",
      Słodycze: "🍫",
      Chemia: "🧽",
      Kosmetyki: "💄",
      "Dom i ogród": "🏠",
      Inne: "📦",
    };
    return categoryMap[category] || "📦";
  };

  return <span className="text-lg">{getCategoryEmoji(category)}</span>;
}
