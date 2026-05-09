'use client';
import { useState, useEffect } from 'react';
import SectionHeader from '@/components/SectionHeader';
import WriterCard from '@/components/WriterCard';
import { api } from '@/lib/api';

export default function WritersPage() {
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWriters().then(setWriters).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ marginTop: 16 }}>
      <SectionHeader accent="var(--purple)">writers we love</SectionHeader>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>loading writers...</div>
      ) : writers.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {writers.map(w => <WriterCard key={w.id} writer={w} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--mono)', opacity: 0.5 }}>no writers yet.</div>
      )}
    </div>
  );
}
