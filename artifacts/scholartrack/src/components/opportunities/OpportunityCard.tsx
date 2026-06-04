import { Opportunity } from '@/lib/definitions';
import { useNavigate } from '@/components/layout/NavContext';

const TYPE_COLORS: Record<string, string> = {
  Internship: 'bg-blue-50 text-blue-700 border-blue-200',
  Scholarship: 'bg-purple-50 text-purple-700 border-purple-200',
  Competition: 'bg-amber-50 text-amber-700 border-amber-200',
};

const TYPE_ORG_BG: Record<string, string> = {
  Internship: 'bg-blue-500',
  Scholarship: 'bg-purple-500',
  Competition: 'bg-amber-500',
};

const STATUS_STYLES: Record<string, string> = {
  Saved: 'bg-blue-50 text-blue-700 border-blue-200',
  Planning: 'bg-amber-50 text-amber-700 border-amber-200',
  Applying: 'bg-purple-50 text-purple-700 border-purple-200',
  Submitted: 'bg-sky-50 text-sky-700 border-sky-200',
  Accepted: 'bg-green-50 text-green-700 border-green-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
};

interface OpportunityCardProps {
  opportunity: Opportunity;
}

function getDeadlineInfo(deadline: string) {
  const date = new Date(deadline);
  const now = new Date();
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { text: 'Expired', urgent: true };
  if (diff === 0) return { text: 'Due today', urgent: true };
  if (diff <= 7) return { text: `${diff}d left`, urgent: true };
  return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), urgent: false };
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { navigate } = useNavigate();
  const deadline = getDeadlineInfo(opportunity.deadline);
  const orgBg = TYPE_ORG_BG[opportunity.type] ?? 'bg-gray-500';
  const typeCls = TYPE_COLORS[opportunity.type] ?? 'bg-gray-50 text-gray-700 border-gray-200';
  const statusCls = STATUS_STYLES[opportunity.status] ?? 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <div
      onClick={() => navigate(`/opportunities/${opportunity.id}/apply`)}
      className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm card-hover cursor-pointer flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${orgBg} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
          {opportunity.organization.charAt(0)}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${typeCls}`}>
          {opportunity.type}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1 group-hover:text-blue-600 transition-colors">
        {opportunity.title}
      </h3>
      <p className="text-sm text-gray-400 mb-3">{opportunity.organization}</p>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4 flex-1">
        {opportunity.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusCls}`}>
          {opportunity.status}
        </span>
        <div className={`flex items-center gap-1 text-xs font-medium ${deadline.urgent ? 'text-amber-600' : 'text-gray-400'}`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {deadline.text}
        </div>
      </div>
    </div>
  );
}
