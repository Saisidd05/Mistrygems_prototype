import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Info } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';

// Dummy data – in a real app this would be fetched from an API
const workshops = [
  {
    id: 'w1',
    name: 'Elegant Jewels Workshop',
    description: 'Hand‑crafted silver jewellery with a modern touch.',
    rating: 4.5,
    reviews: [
      { author: 'Ravi', comment: 'Great quality and fast delivery!' },
      { author: 'Lakshmi', comment: 'Beautiful designs, love them.' },
    ],
  },
  {
    id: 'w2',
    name: 'Silver Heritage',
    description: 'Traditional artisans from Gujarat creating timeless pieces.',
    rating: 4.7,
    reviews: [
      { author: 'Anita', comment: 'Excellent craftsmanship.' },
      { author: 'Deepak', comment: 'Very professional service.' },
    ],
  },
];

export function Vendors() {
  const [selected, setSelected] = useState<typeof workshops[0] | null>(null);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-[#f0f4ff] to-[#e0eaff] relative">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Workshop Directory</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((w) => (
          <GlassCard key={w.id} className="p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900">{w.name}</h2>
              <p className="text-sm text-gray-600 mb-3">{w.description}</p>
              <p className="text-sm text-gray-700">Rating: {w.rating} ★</p>
            </div>
            <button
              className="mt-4 self-start text-primary-600 hover:underline"
              onClick={() => setSelected(w)}
            >
              View More
            </button>
          </GlassCard>
        ))}
      </div>

      {/* Dialog for details */}
      <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 outline-none"
          >
            {selected && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selected.name}</h2>
                  <Dialog.Close asChild>
                    <button className="text-gray-500 hover:text-gray-800">
                      <X size={24} />
                    </button>
                  </Dialog.Close>
                </div>
                <p className="mb-4 text-gray-700">{selected.description}</p>
                <p className="mb-4 text-gray-600">Rating: {selected.rating} ★</p>
                <Info className="text-primary-500 mb-2" size={20} />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Reviews</h3>
                <ul className="space-y-2">
                  {selected.reviews.map((rev, idx) => (
                    <li key={idx} className="border-l-4 border-primary-200 pl-2 text-sm text-gray-700">
                      <strong>{rev.author}:</strong> {rev.comment}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
