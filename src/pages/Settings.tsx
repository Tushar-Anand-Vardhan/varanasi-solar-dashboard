import { useState } from 'react';
import { Save, User, MessageSquare, Palette, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ENV, WHATSAPP_TEMPLATES } from '@/config/env';
import { mockUsers } from '@/mocks/data';

export default function Settings() {
  const [brandName, setBrandName] = useState('Varanasi Solar');
  const [ownerNumber, setOwnerNumber] = useState(ENV.OWNER_NUMBER);
  const [ownerTemplate, setOwnerTemplate] = useState(WHATSAPP_TEMPLATES.owner);
  const [customerTemplate, setCustomerTemplate] = useState(WHATSAPP_TEMPLATES.customer);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: 'Settings saved! ✨',
      description: 'Your changes have been applied.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-header-primary">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your Varanasi Solar CRM.
        </p>
      </div>

      {/* Brand Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Brand Settings
          </CardTitle>
          <CardDescription>
            Customize your business identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">Business Name</Label>
            <Input
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Varanasi Solar"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-2xl">☀️</span>
              </div>
              <Button variant="outline" size="sm">
                Upload Logo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            WhatsApp Settings
          </CardTitle>
          <CardDescription>
            Configure WhatsApp integration and message templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ownerNumber">Owner WhatsApp Number</Label>
            <Input
              id="ownerNumber"
              value={ownerNumber}
              onChange={(e) => setOwnerNumber(e.target.value)}
              placeholder="919876543210"
            />
            <p className="text-xs text-muted-foreground">
              Include country code without + (e.g., 919876543210 for India)
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="ownerTemplate">Owner Notification Template</Label>
            <Textarea
              id="ownerTemplate"
              value={ownerTemplate}
              onChange={(e) => setOwnerTemplate(e.target.value)}
              rows={3}
              placeholder="New lead: {name} ({phone}) — needs follow-up!"
            />
            <p className="text-xs text-muted-foreground">
              Variables: {'{name}'}, {'{phone}'}, {'{address}'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerTemplate">Customer Welcome Template</Label>
            <Textarea
              id="customerTemplate"
              value={customerTemplate}
              onChange={(e) => setCustomerTemplate(e.target.value)}
              rows={3}
              placeholder="Namaste {name}! Thank you for your interest..."
            />
            <p className="text-xs text-muted-foreground">
              Variables: {'{name}'}, {'{phone}'}, {'{address}'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Team Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            Manage your sales team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
                  {user.role}
                </span>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <User className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Settings (for developers) */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Settings for connecting to your backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-mono">
              MOCK_MODE: <span className="text-cta">{ENV.MOCK_MODE ? 'true' : 'false'}</span>
            </p>
            <p className="text-sm font-mono mt-1">
              API_URL: <span className="text-cta">{ENV.API_URL}</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            To connect to a real API, set VITE_MOCK_MODE=false and VITE_API_URL in your environment variables.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-cta hover:bg-cta/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
