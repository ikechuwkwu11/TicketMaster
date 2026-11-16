export default function HorizontalScroll({ children, className = '' }) {
  return (
    <div
      className={`hide-scrollbar scroll-touch flex gap-3 overflow-x-auto px-4 pb-1 md:gap-4 md:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
