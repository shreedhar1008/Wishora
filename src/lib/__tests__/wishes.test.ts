import { describe, it, expect } from 'vitest';
import { DemoDataAdapter } from '../demo/data';
import { TEMPLATES } from '../templates/definitions';

describe('Wishora Core Functionality', () => {
  it('has valid template definitions', () => {
    expect(TEMPLATES.length).toBeGreaterThan(0);
    for (const t of TEMPLATES) {
      expect(t.id).toBeDefined();
      expect(t.slug).toBeDefined();
      expect(t.title).toBeDefined();
      expect(t.occasion).toBeDefined();
    }
  });

  it('creates and retrieves wishes in DemoDataAdapter without losing metadata', async () => {
    const adapter = new DemoDataAdapter();
    const created = await adapter.createWish({
      recipientName: 'Alice',
      senderName: 'Bob',
      occasion: 'birthday',
      templateSlug: 'birthday-balloon-blast',
      title: 'Happy Birthday Alice!',
      message: 'Have an awesome day!',
      isPublished: true,
      isPublic: true,
    });

    expect(created.publicToken).toBeDefined();
    expect(created.recipientName).toBe('Alice');
    expect(created.senderName).toBe('Bob');
    expect(created.status).toBe('published');
    expect(created.visibility).toBe('public');

    const fetched = await adapter.getWishByToken(created.publicToken);
    expect(fetched).not.toBeNull();
    expect(fetched?.recipientName).toBe('Alice');
    expect(fetched?.message).toBe('Have an awesome day!');
  });

  it('supports reactions and views in demo adapter', async () => {
    const adapter = new DemoDataAdapter();
    const created = await adapter.createWish({
      recipientName: 'Charlie',
      message: 'Congratulations!',
      isPublished: true,
    });

    await adapter.addReaction(created.id, 'heart');
    await adapter.addView(created.id, 'mobile', 'direct');

    const stats = await adapter.getWishStats(created.id);
    expect(stats.reactions).toBeGreaterThanOrEqual(1);
    expect(stats.views).toBeGreaterThanOrEqual(1);
  });
});
