import MainLayout from '@/components/layout/MainLayout';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const exploreImages = [
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&q=80',
  'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220067-dced9a881b56?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220208-22d7a2543e88?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&q=80',
  'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220067-dced9a881b56?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220208-22d7a2543e88?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=400&q=80',
];

export default function Explore() {
  return (
    <MainLayout>
      <div className="max-w-[935px] mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 bg-gray-100 border-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {exploreImages.map((image, index) => (
            <div
              key={index}
              className="aspect-square relative group cursor-pointer overflow-hidden"
            >
              <img
                src={image}
                alt={`Explore ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
