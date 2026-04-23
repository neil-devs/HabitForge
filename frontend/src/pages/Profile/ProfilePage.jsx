import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { useUiStore } from '../../store/uiStore';
import { Camera } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, checkAuth } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const { showConfirm } = useUiStore();

  const deleteAccount = useMutation({
    mutationFn: async () => {
      await api.delete('/users/account');
    },
    onSuccess: () => {
      toast.success('Account deleted forever. Goodbye!');
      logout(); // This will clear zustand and redirect to login
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  });

  const uploadAvatar = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/users/profile/avatar', formData);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Profile picture updated!');
      checkAuth(); // Refresh user data
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be smaller than 5MB');
      return;
    }
    
    uploadAvatar.mutate(file);
  };

  const handleDelete = () => {
    showConfirm({
      title: 'Delete Account?',
      message: 'Are you absolutely sure you want to delete your account? This action cannot be undone and all your habits, XP, and streaks will be lost forever.',
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
      onConfirm: () => deleteAccount.mutate()
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold">Profile Settings</h1>
      
      <Card className="p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <Avatar src={user?.avatar_url ? `http://localhost:5000${user.avatar_url}` : null} fallback={user?.username} size="2xl" className="ring-4 ring-bg-tertiary group-hover:opacity-50 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={32} className="text-white drop-shadow-lg" />
          </div>
          {uploadAvatar.isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <div className="w-8 h-8 border-4 border-accent-amber border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">{user?.display_name || user?.username}</h2>
          <p className="text-text-muted">{user?.email}</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
             <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Account Details</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
            <div className="bg-bg-tertiary px-3 py-2 rounded-lg text-sm">{user?.username}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <div className="bg-bg-tertiary px-3 py-2 rounded-lg text-sm">{user?.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Member Since</label>
            <div className="bg-bg-tertiary px-3 py-2 rounded-lg text-sm">{new Date(user?.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 border-accent-rose/20">
        <h3 className="font-bold text-lg mb-2 text-accent-rose">Danger Zone</h3>
        <p className="text-sm text-text-muted mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <Button variant="danger" onClick={handleDelete} isLoading={deleteAccount.isPending}>Delete Account</Button>
      </Card>
      
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};

export default ProfilePage;
