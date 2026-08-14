'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Textarea, Card, Select } from '@/components/ui';
import { TEMPLATES } from '@/lib/templates/definitions';

const composeSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required'),
  senderName: z.string().optional(),
  title: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  isPublic: z.boolean(),
  allowReactions: z.boolean(),
  allowReplies: z.boolean(),
});

type ComposeValues = z.infer<typeof composeSchema>;

export default function CreateSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;
  const template = useMemo(() => TEMPLATES.find((t) => t.slug === slug), [slug]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<ComposeValues>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      message: template?.defaultMessage || '',
      isPublic: false,
      allowReactions: true,
      allowReplies: true,
    }
  });

  if (!template) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-6xl mb-6">😢</div>
        <h2 className="text-3xl font-bold tracking-tight text-charcoal mb-4">Template not found</h2>
        <p className="text-charcoal-muted mb-8">The template you are looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/create')}>Browse Templates</Button>
      </div>
    );
  }

  const onSubmit = async (data: ComposeValues) => {
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        templateId: template.id,
        templateSlug: template.slug,
        occasion: template.occasion,
        recipientName: data.recipientName,
        senderName: data.senderName,
        title: data.title,
        message: data.message,
        isPublic: data.isPublic,
        isPublished: true, // Auto-publish for now
        settings: {
          allowReactions: data.allowReactions,
          allowReplies: data.allowReplies,
        }
      };

      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create wish');
      }

      const createdWish = await res.json();
      router.push(`/create/${template.slug}/share?token=${createdWish.publicToken}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-ivory py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Compose your Wish</h1>
          <p className="text-charcoal-muted">Customizing: <span className="font-semibold text-plum">{template.title} {template.emoji}</span></p>
        </div>

        <Card className="p-8 border-none shadow-elevated">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Who is this for? *</label>
                <Input
                  {...register('recipientName')}
                  placeholder="Recipient's Name"
                  error={errors.recipientName?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Who is it from?</label>
                <Input
                  {...register('senderName')}
                  placeholder="Your Name (Optional)"
                  error={errors.senderName?.message}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Title (Optional)</label>
              <Input
                {...register('title')}
                placeholder="e.g. Happy Birthday!"
                error={errors.title?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Your Message *</label>
              <Textarea
                {...register('message')}
                placeholder="Write something nice..."
                rows={5}
                error={errors.message?.message}
              />
            </div>

            <div className="pt-6 border-t border-border-light space-y-4">
              <h3 className="text-lg font-semibold text-charcoal">Settings</h3>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isPublic"
                    type="checkbox"
                    className="w-4 h-4 text-plum bg-surface border-border-light rounded focus:ring-plum"
                    {...register('isPublic')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isPublic" className="font-medium text-charcoal">Make this wish public</label>
                  <p className="text-charcoal-muted">Allow this wish to be featured on the Explore page.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="allowReactions"
                    type="checkbox"
                    className="w-4 h-4 text-plum bg-surface border-border-light rounded focus:ring-plum"
                    {...register('allowReactions')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allowReactions" className="font-medium text-charcoal">Allow Reactions</label>
                  <p className="text-charcoal-muted">Let the recipient send emoji reactions.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="allowReplies"
                    type="checkbox"
                    className="w-4 h-4 text-plum bg-surface border-border-light rounded focus:ring-plum"
                    {...register('allowReplies')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allowReplies" className="font-medium text-charcoal">Allow Replies</label>
                  <p className="text-charcoal-muted">Let the recipient write a reply message to you.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={isSubmitting}
              >
                Create Wish ✨
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
