import { Link } from 'react-router-dom';

export default function SectionHeader({ title, viewAllTo }) {
  return (
    <div className="mb-3 flex items-baseline justify-between px-4 md:px-6 lg:px-8">
      <h2 className="text-[18px] font-bold leading-tight text-white md:text-xl">
        {title}
      </h2>
      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="text-[13px] font-medium text-[#A0A0A0] transition-colors hover:text-white"
        >
          View All
        </Link>
      )}
    </div>
  );
}
