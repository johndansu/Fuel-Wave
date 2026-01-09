import type { WorkMoment } from '../../types';
import { format } from 'date-fns';

interface MomentCardProps {
  moment: WorkMoment;
  onClick?: () => void;
}

export function MomentCard({ moment, onClick }: MomentCardProps) {
  const stateColors = {
    advanced: 'border-l-emerald-500 bg-emerald-50',
    stuck: 'border-l-amber-500 bg-amber-50',
    resolved: 'border-l-blue-500 bg-blue-50',
  };

  const stateLabels = {
    advanced: 'Advanced',
    stuck: 'Stuck',
    resolved: 'Resolved',
  };

  const energyIcons = {
    low: '○',
    medium: '◐',
    heavy: '●',
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${stateColors[moment.state_after]}`}
    >
      <p className="text-gray-800 mb-3">{moment.effort_text}</p>
      
      {moment.context_note && (
        <p className="text-sm text-gray-500 mb-3 italic">
          {moment.context_note}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            moment.state_after === 'advanced' ? 'bg-emerald-200 text-emerald-800' :
            moment.state_after === 'stuck' ? 'bg-amber-200 text-amber-800' :
            'bg-blue-200 text-blue-800'
          }`}>
            {stateLabels[moment.state_after]}
          </span>
          <span className="text-gray-400" title={`Energy: ${moment.energy_cost}`}>
            {energyIcons[moment.energy_cost]} {moment.energy_cost}
          </span>
        </div>
        <span className="text-gray-400">
          {format(new Date(moment.created_at), 'h:mm a')}
        </span>
      </div>
    </div>
  );
}
