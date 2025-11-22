import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import { storyService } from '@/services/api.service';

export default function CreateStory() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setUploading(true);
    try {
      await storyService.createStory({ image, caption });
      navigate('/');
    } catch (error) {
      console.error('Failed to create story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[800px] mx-auto py-8 px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Create Story</h1>
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Upload an image for your story</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="story-image"
                />
                <label htmlFor="story-image">
                  <Button type="button" onClick={() => document.getElementById('story-image')?.click()}>
                    Select Image
                  </Button>
                </label>
              </div>
            ) : (
              <div className="relative mb-6">
                <img
                  src={previewUrl}
                  alt="Story preview"
                  className="w-full max-h-[500px] object-contain rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImage('');
                    setPreviewUrl('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Caption */}
            {previewUrl && (
              <>
                <div className="mb-6">
                  <label htmlFor="caption" className="block text-sm font-medium mb-2">
                    Caption (optional)
                  </label>
                  <textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading || !image}>
                    {uploading ? 'Sharing...' : 'Share Story'}
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
