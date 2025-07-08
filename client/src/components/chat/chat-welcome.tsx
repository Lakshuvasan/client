interface ChatWelcomeProps {
  onSuggestionClick: (question: string) => void;
}

export function ChatWelcome({ onSuggestionClick }: ChatWelcomeProps) {
  const suggestions = [
    {
      question: "Which certifications are good for cloud computing?",
      title: "Cloud Computing",
      icon: "fas fa-cloud",
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
    },
    {
      question: "I'm a beginner in cybersecurity. What should I start with?",
      title: "Cybersecurity",
      icon: "fas fa-shield-alt",
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
    },
    {
      question: "Best project management certifications for 2024?",
      title: "Project Management",
      icon: "fas fa-tasks",
      iconBg: "bg-green-100",
      iconColor: "text-accent",
    },
    {
      question: "Which data science certifications are most valuable?",
      title: "Data Science",
      icon: "fas fa-chart-bar",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="px-4 py-8 text-center animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-graduation-cap text-white text-2xl"></i>
        </div>
        <h2 className="text-3xl font-semibold text-slate-800 mb-4">Welcome to CERTI-BOT</h2>
        <p className="text-lg text-secondary mb-8">
          I'm your AI-powered certification assistant. Ask me about any certification program, 
          and I'll help you find the perfect match for your skills and career goals.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-card p-4 bg-surface rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all text-left"
              onClick={() => onSuggestionClick(suggestion.question)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${suggestion.iconBg} rounded-lg flex items-center justify-center`}>
                  <i className={`${suggestion.icon} ${suggestion.iconColor}`}></i>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">{suggestion.title}</h3>
                  <p className="text-sm text-secondary">{suggestion.question}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
