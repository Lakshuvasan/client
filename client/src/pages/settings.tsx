import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/theme-provider";
import { ArrowLeft, Settings, Bell, Shield, Trash2, Download, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      recommendations: true,
      updates: true,
    },
    privacy: {
      shareData: false,
      publicProfile: false,
    },
    preferences: {
      language: "en",
      timezone: "UTC",
      chatHistory: true,
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be logged in to access settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been updated.",
    });
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
    toast({
      title: "Settings Updated",
      description: "Your privacy settings have been updated.",
    });
  };

  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
    toast({
      title: "Settings Updated",
      description: "Your preferences have been updated.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export has been initiated. You'll receive an email when ready.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "This feature is not yet implemented. Contact support for assistance.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chat
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Settings className="h-6 w-6" />
              <span>Settings</span>
            </h1>
            <p className="text-muted-foreground">Manage your account preferences and privacy settings.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Configure how you want to receive notifications and updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get instant notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Certification Recommendations</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive personalized certification suggestions
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.recommendations}
                  onCheckedChange={(checked) => handleNotificationChange('recommendations', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Product Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Stay informed about new features and improvements
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.updates}
                  onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>
                Control your privacy settings and data sharing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share Usage Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve CERTI-BOT by sharing anonymous usage data
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareData}
                  onCheckedChange={(checked) => handlePrivacyChange('shareData', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.publicProfile}
                  onCheckedChange={(checked) => handlePrivacyChange('publicProfile', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>
                Customize your experience with language and regional settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred theme
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={settings.preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={settings.preferences.timezone} onValueChange={(value) => handlePreferenceChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="GMT">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Save Chat History</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep your conversation history for future reference
                  </p>
                </div>
                <Switch
                  checked={settings.preferences.chatHistory}
                  onCheckedChange={(checked) => handlePreferenceChange('chatHistory', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your personal data and account information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Export My Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of all your data
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-destructive">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}