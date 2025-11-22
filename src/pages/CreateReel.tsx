import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import { reelService } from '@/services/api.service';

export default function CreateReel() {
  const navigate = useNavigate();
  const [video, setVideo] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>('');

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setVideo(result);
        setVideoPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setThumbnail(result);
        setThumbnailPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !thumbnail) return;

    setUploading(true);
    try {
      await reelService.createReel({ video, thumbnail, caption });
      navigate('/reels');
    } catch (error) {
      console.error('Failed to create reel:', error);
      alert('Failed to create reel. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[800px] mx-auto py-8 px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Create Reel</h1>
            <Button variant="ghost" size="icon" onClick={() => navigate('/reels')}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Video Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Video</label>
              {!videoPreviewUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Upload a video for your reel</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="reel-video"
                  />
                  <label htmlFor="reel-video">
                    <Button type="button" onClick={() => document.getElementById('reel-video')?.click()}>
                      Select Video
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <video
                    src={videoPreviewUrl}
                    controls
                    className="w-full max-h-[400px] object-contain rounded-lg bg-black"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setVideo('');
                      setVideoPreviewUrl('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            {videoPreviewUrl && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Thumbnail</label>
                {!thumbnailPreviewUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 mb-2 text-sm">Upload a thumbnail image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      id="reel-thumbnail"
                    />
                    <label htmlFor="reel-thumbnail">
                      <Button type="button" size="sm" onClick={() => document.getElementById('reel-thumbnail')?.click()}>
                        Select Thumbnail
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={thumbnailPreviewUrl}
                      alt="Thumbnail preview"
                      className="w-full max-h-[200px] object-contain rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setThumbnail('');
                        setThumbnailPreviewUrl('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Caption */}
            {videoPreviewUrl && thumbnailPreviewUrl && (
              <>
                <div className="mb-6">
                  <label htmlFor="caption" className="block text-sm font-medium mb-2">
                    Caption (optional)
                  </label>
                  <textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption... Use #hashtags"
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/reels')}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading || !video || !thumbnail}>
                    {uploading ? 'Sharing...' : 'Share Reel'}
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
