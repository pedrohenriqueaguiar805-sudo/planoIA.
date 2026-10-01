import React, { useEffect, useState } from 'react';
import {
  AppState,
  BillingCycle,
  ContentPost,
  SubscriptionTier,
  SubscriptionTierId,
} from './types';
import { INITIAL_APP_STATE } from './data/initialData';
import { LandingView } from './components/LandingView';
import { StudioWorkspace } from './components/StudioWorkspace';
import { PostDetailDrawer } from './components/PostDetailDrawer';
import { CheckoutModal } from './components/CheckoutModal';

const STORAGE_KEY = 'planoia_saas_state_v1';

export function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'studio'>('landing');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_APP_STATE;
  });

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [checkoutTier, setCheckoutTier] = useState<SubscriptionTier | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load state from backend on first mount if available
  useEffect(() => {
    fetch('/api/state')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.brands && Array.isArray(data.brands)) {
          setState(data);
        }
      })
      .catch(() => {
        // fallback to localStorage
      });
  }, []);

  // Persist state to localStorage + backend API
  const updateState = (updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      }).catch(() => {
        // ignore offline
      });
      return next;
    });
  };

  const activeBrand =
    state.brands.find((b) => b.id === state.activeBrandId) || state.brands[0];
  const selectedPost =
    state.posts.find((p) => p.id === selectedPostId) || null;

  const handleOpenApp = (brandId?: string) => {
    if (brandId) {
      updateState((prev) => ({ ...prev, activeBrandId: brandId }));
    }
    setViewMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmSubscription = (
    tierId: SubscriptionTierId,
    cycle: BillingCycle
  ) => {
    updateState((prev) => ({
      ...prev,
      currentTier: tierId,
      billingCycle: cycle,
    }));
    setCheckoutTier(null);
    setViewMode('studio');
  };

  const handleUpdatePost = (updated: ContentPost) => {
    updateState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p.id === updated.id ? updated : p)),
    }));
  };

  const handleDeletePost = (postId: string) => {
    updateState((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== postId),
    }));
  };

  return (
    <div className="min-h-screen relative">
      {viewMode === 'landing' ? (
        <LandingView
          brands={state.brands}
          posts={state.posts}
          currentTier={state.currentTier}
          billingCycle={state.billingCycle}
          onChangeBillingCycle={(cycle) =>
            updateState((prev) => ({ ...prev, billingCycle: cycle }))
          }
          onOpenApp={handleOpenApp}
          onSelectTierForCheckout={(tier) => setCheckoutTier(tier)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
        />
      ) : (
        <StudioWorkspace
          state={state}
          onUpdateState={updateState}
          onSelectPost={(post) => setSelectedPostId(post.id)}
          onOpenCheckout={(tier) => setCheckoutTier(tier)}
          onBackToLanding={() => {
            setViewMode('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
        />
      )}

      {/* Post Detail & Copywriting Slide-Over Drawer */}
      {selectedPost && activeBrand && (
        <PostDetailDrawer
          post={selectedPost}
          brand={activeBrand}
          onClose={() => setSelectedPostId(null)}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
        />
      )}

      {/* Subscription Tier Checkout Modal */}
      {checkoutTier && (
        <CheckoutModal
          tier={checkoutTier}
          billingCycle={state.billingCycle}
          onClose={() => setCheckoutTier(null)}
          onConfirmSubscription={handleConfirmSubscription}
        />
      )}
    </div>
  );
}

export default App;
