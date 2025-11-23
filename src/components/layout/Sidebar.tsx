import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare, User, Menu, Instagram } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Film, label: 'Reels', path: '/reels' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: Heart, label: 'Notifications', path: '/notifications' },
    { icon: PlusSquare, label: 'Create', path: '/create' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white flex flex-col z-50">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <Instagram className="w-8 h-8" />
          <span className="text-xl font-semibold">Instagram</span>
        </Link>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-gray-100 font-semibold'
                    : 'hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'fill-current' : ''}`} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          
          <li>
            <Link
              to={`/profile/${user?.username}`}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                location.pathname.includes('/profile')
                  ? 'bg-gray-100 font-semibold'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-3 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-4 px-3">
              <Menu className="w-6 h-6" />
              <span>More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>Your activity</DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/saved'}>
              Saved
            </DropdownMenuItem>
            <DropdownMenuItem>Switch appearance</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
