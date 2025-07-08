export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <i className="fas fa-robot text-white text-sm"></i>
        </div>
        <div className="bg-surface border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-secondary rounded-full animate-typing"></div>
            <div className="w-2 h-2 bg-secondary rounded-full animate-typing" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-secondary rounded-full animate-typing" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
