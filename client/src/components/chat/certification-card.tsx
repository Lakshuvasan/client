interface Certification {
  id: number;
  name: string;
  provider: string;
  description: string;
  prepTime: string;
  examFee: string;
  icon: string;
  iconColor: string;
  relevanceScore?: number;
  reasoning?: string;
}

interface CertificationCardProps {
  certification: Certification;
}

export function CertificationCard({ certification }: CertificationCardProps) {
  return (
    <div className="certification-card rounded-lg p-3">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
          <i className={`${certification.icon} ${certification.iconColor} text-sm`}></i>
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-slate-800 mb-1">{certification.name}</h4>
          <p className="text-sm text-secondary mb-2">{certification.description}</p>
          {certification.reasoning && (
            <p className="text-sm text-slate-600 mb-2 italic">
              💡 {certification.reasoning}
            </p>
          )}
          <div className="flex items-center space-x-4 text-xs text-secondary">
            <span className="flex items-center space-x-1">
              <i className="fas fa-clock"></i>
              <span>{certification.prepTime}</span>
            </span>
            <span className="flex items-center space-x-1">
              <i className="fas fa-dollar-sign"></i>
              <span>{certification.examFee}</span>
            </span>
            {certification.relevanceScore && (
              <span className="flex items-center space-x-1">
                <i className="fas fa-star text-yellow-500"></i>
                <span>{certification.relevanceScore}/10 match</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
