import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/logo_1752088433660.jpg";
import { 
  MessageSquare, 
  Brain, 
  Award, 
  Zap, 
  Users, 
  Shield, 
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Get personalized certification suggestions based on your skills and career goals using advanced AI technology."
    },
    {
      icon: MessageSquare,
      title: "Interactive Chat Interface",
      description: "Have natural conversations about certifications, requirements, and career paths in real-time."
    },
    {
      icon: Award,
      title: "Comprehensive Database",
      description: "Access information on 15+ popular certifications across cloud computing, cybersecurity, and more."
    },
    {
      icon: Zap,
      title: "Instant Insights",
      description: "Get immediate answers about exam costs, preparation time, difficulty levels, and career benefits."
    }
  ];

  const certifications = [
    { name: "AWS Solutions Architect", category: "Cloud Computing", difficulty: "Intermediate" },
    { name: "CISSP", category: "Cybersecurity", difficulty: "Advanced" },
    { name: "PMP", category: "Project Management", difficulty: "Intermediate" },
    { name: "Google Cloud Professional", category: "Cloud Computing", difficulty: "Advanced" },
    { name: "CompTIA Security+", category: "Cybersecurity", difficulty: "Beginner" },
    { name: "Scrum Master", category: "Agile", difficulty: "Beginner" }
  ];



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="CERTI-BOT" 
                className="h-12 w-auto object-contain"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered Certification Assistant
          </Badge>
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            Find Your Perfect
            <span className="text-primary block">Certification Path</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Get personalized certification recommendations, explore career paths, and make informed decisions 
            about your professional development with our intelligent AI assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Try Demo Account</Link>
            </Button>
          </div>
          
          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-slate-50 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-slate-600 mb-2">Quick Demo Access:</p>
            <div className="text-xs text-slate-500 space-y-1">
              <div>👨‍💼 Admin: admin@certibot.com / admin123</div>
              <div>👤 User: user@certibot.com / user123</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Why Choose CERTI-BOT?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our AI-powered platform makes certification discovery simple, personalized, and efficient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Certifications */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Popular Certifications
            </h2>
            <p className="text-lg text-slate-600">
              Explore some of the most sought-after certifications in today's market.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                    <Badge variant={
                      cert.difficulty === 'Beginner' ? 'secondary' :
                      cert.difficulty === 'Intermediate' ? 'default' : 'destructive'
                    }>
                      {cert.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{cert.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>In our database</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Ready to Discover Your Next Certification?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join CERTI-BOT today and let our AI guide you to the perfect certification for your career goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img 
                src={logoImage} 
                alt="CERTI-BOT" 
                className="h-10 w-auto object-contain mb-4 filter brightness-0 invert"
              />
              <p className="text-slate-300">
                Your intelligent certification discovery partner.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/login" className="hover:text-white">AI Assistant</Link></li>
                <li><Link href="/register" className="hover:text-white">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-300">
            <p>&copy; 2025 CERTI-BOT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}