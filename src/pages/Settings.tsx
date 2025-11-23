import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ChevronRight, 
  Lock, 
  Bell, 
  Eye, 
  Shield, 
  HelpCircle,
  Info,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: Lock, label: 'Privacy', action: () => {} },
        { icon: Shield, label: 'Security', action: () => {} },
        { icon: Bell, label: 'Notifications', action: () => {} },
      ],
    },
    {
      title: 'Content',
      items: [
        { icon: Eye, label: 'Account Privacy', action: () => setIsPrivate(!isPrivate) },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help', action: () => {} },
        { icon: Info, label: 'About', action: () => {} },
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-[600px] mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-8">Settings</h1>

        {/* Profile Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={user?.username || ''}
                disabled
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                placeholder="Tell your story..."
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                defaultValue={user?.bio || ''}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="private">Private Account</Label>
                <p className="text-xs text-gray-500 mt-1">
                  Only approved followers can see your posts
                </p>
              </div>
              <button
                onClick={() => setIsPrivate(!isPrivate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPrivate ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPrivate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <Button className="w-full mt-6">Save Changes</Button>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-white border border-gray-200 rounded-lg mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold">{section.title}</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <button
            onClick={handleLogout}
            className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Log Out</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
