import React from 'react';
import type { ReviewsConfig, ThemeConfig } from '@appkit/schema';

const mockReviews = [
  { name: 'Sarah M.', text: 'Absolutely love this! The quality is amazing and it fits perfectly. Will definitely order again.', stars: 5, avatar: 'S', color: '#8b5cf6', date: '2 days ago' },
  { name: 'James K.', text: 'Great value for the price. Shipped fast and exactly as described. Highly recommend!', stars: 5, avatar: 'J', color: '#06b6d4', date: '1 week ago' },
  { name: 'Emily R.', text: 'Beautiful piece, got so many compliments. The material feels premium.', stars: 4, avatar: 'E', color: '#f43f5e', date: '3 days ago' },
  { name: 'David L.', text: 'Exceeded my expectations. Perfect gift idea. Customer service was excellent too.', stars: 5, avatar: 'D', color: '#10b981', date: '5 days ago' },
];

export function ReviewsRenderer({ config, theme }: { config: ReviewsConfig; theme: ThemeConfig }) {
  const rc = config.reviewsConfig;
  const count = Math.min(rc.productLimit || 3, 4);

  return (
    <div style={{ padding: '12px 14px' }}>
      {rc.title && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.colors.text, letterSpacing: '-0.02em' }}>{rc.title}</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            backgroundColor: '#fef3c7', padding: '3px 8px', borderRadius: 6,
          }}>
            <span style={{ fontSize: 11, color: '#f59e0b' }}>★</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e' }}>4.8</span>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
        {mockReviews.slice(0, count).map((review, i) => (
          <div key={i} style={{
            minWidth: 200,
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: '14px 14px 12px',
            border: '1px solid #f3f4f6',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                backgroundColor: review.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 13, fontWeight: 700,
              }}>{review.avatar}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: theme.colors.text }}>{review.name}</div>
                <div style={{ fontSize: 9, color: '#9ca3af' }}>{review.date}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
              {Array.from({ length: 5 }, (_, s) => (
                <span key={s} style={{ fontSize: 11, color: s < review.stars ? '#f59e0b' : '#e5e7eb' }}>★</span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.5 }}>{review.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
