export default function Spinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <span>{text}</span>
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-opacity-75"></div>
    </div>
  );
}
