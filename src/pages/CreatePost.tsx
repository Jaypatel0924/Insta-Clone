import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Image as ImageIcon } from 'lucide-react';
import { usePostStore } from '@/store/usePostStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function CreatePost() {
  const navigate = useNavigate();
  const { addPost } = usePostStore();
  const { user } = useAuthStore();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleImageSelect = () => {
    // Mock image selection - in real app, use file input
    const mockImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    ];
    setSelectedImages(mockImages);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedImages.length || !user) return;

    const hashtags = caption.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];

    const newPost = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      userAvatar: user.profilePicture,
      images: selectedImages,
      caption: caption,
      hashtags: hashtags,
      location: location,
      likes: 0,
      comments: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString(),
    };

    addPost(newPost);
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="max-w-[800px] mx-auto py-8 px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-6">Create new post</h1>

          {/* Image Selection */}
          <div className="mb-6">
            <Label className="mb-2 block">Photos</Label>
            {selectedImages.length === 0 ? (
              <button
                onClick={handleImageSelect}
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
              >
                <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500">Click to select photos</p>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Selected ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {selectedImages.length < 10 && (
                  <button
                    onClick={handleImageSelect}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="mb-6">
            <Label htmlFor="caption" className="mb-2 block">
              Caption
            </Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption... Use #hashtags"
              className="min-h-[100px]"
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <Label htmlFor="location" className="mb-2 block">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!selectedImages.length}
              className="flex-1"
            >
              Share
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
