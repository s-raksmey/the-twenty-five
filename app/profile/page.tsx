'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const defaultProfile = {
  name: 'Jordan Carter',
  email: 'jordan.carter@example.com',
  role: 'Product Manager',
  location: 'Austin, Texas',
  bio: 'I help teams connect ideas to real-world impact while keeping our users at the heart of every decision.',
};

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const triggerFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);

    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 sm:px-6 lg:px-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Your Profile
          </h1>
          <p className="text-muted-foreground text-base">
            Review your basic information and keep your profile image up to
            date.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>
              This information is only visible to your team and can be updated
              in your account settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 flex-col items-center gap-4 lg:max-w-xs lg:items-start">
              <Avatar className="size-28 border-2 border-border shadow-sm">
                <AvatarImage
                  src={previewUrl ?? undefined}
                  alt={defaultProfile.name}
                />
                <AvatarFallback className="text-lg font-semibold">
                  {defaultProfile.name
                    .split(' ')
                    .map(part => part[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-2 lg:items-start">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button onClick={triggerFileDialog} type="button">
                  Upload new image
                </Button>
                <p className="text-muted-foreground text-xs">
                  PNG or JPG up to 5MB.
                </p>
              </div>
            </div>
            <div className="flex flex-[2] flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={defaultProfile.name} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={defaultProfile.email} readOnly />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={defaultProfile.role} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={defaultProfile.location}
                    readOnly
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">About</Label>
                <textarea
                  id="bio"
                  className="bg-background text-muted-foreground min-h-[120px] w-full resize-none rounded-md border px-3 py-2 text-sm shadow-sm"
                  value={defaultProfile.bio}
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
