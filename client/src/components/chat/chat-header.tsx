export function ChatHeader() {
  return (
    <header className="bg-surface border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">CERTI-BOT</h1>
              <p className="text-sm text-secondary">Intelligent Certification Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm text-secondary">Online</span>
            </div>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <i className="fas fa-bars text-secondary"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
