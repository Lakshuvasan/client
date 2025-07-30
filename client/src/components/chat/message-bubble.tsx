import { CertificationCard } from "./certification-card";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  metadata?: {
    certifications?: any[];
    category?: string;
  };
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  if (message.sender === "user") {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="user-message rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
            <p className="text-black">{message.content}</p>
          </div>
          <div className="flex items-center justify-end mt-1 space-x-2">
            <span className="text-xs text-secondary">
              {formatTime(message.timestamp)}
            </span>
            <i className="fas fa-check text-xs text-accent"></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-slide-up ">
      <div className="flex space-x-3 max-w-xs sm:max-w-md lg:max-w-2xl xl:max-w-3xl">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <i className="fas fa-robot text-black text-sm"></i>
        </div>
        <div className="flex-1">
          <div className="rounded-2xl rounded-bl-md px-4 bg-gray-200 py-3 shadow-sm">
            <div>
              <div className="mb-3 text-black prose prose-sm max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
              {message.metadata?.certifications &&
                message.metadata.certifications.length > 0 && (
                  <div className="space-y-4">
                    {message.metadata.certifications.map((cert, index) => (
                      <CertificationCard
                        key={cert.id || index}
                        certification={cert}
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-xs text-secondary">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
