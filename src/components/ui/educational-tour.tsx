'use client';

import { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Play, CheckCircle, Star, BarChart3, Search } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string;
  tip?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: '🎓 Welcome to Stock Intelligence',
    description: 'This educational platform helps you learn stock market fundamentals safely with simulated data. No real money involved!',
    position: 'center',
    tip: 'This is a learning environment designed for students and educators'
  },
  {
    id: 'sidebar',
    title: '📊 Navigation Sidebar',
    description: 'Use the sidebar to explore different sections: Markets, Watchlist, Comparison tools, and more.',
    targetSelector: '[data-tour="sidebar"]',
    position: 'right',
    action: 'Try clicking different sections in the sidebar'
  },
  {
    id: 'stock-cards',
    title: '📈 Stock Cards',
    description: 'Each card shows key information about a stock. Hover over metrics to learn what they mean!',
    targetSelector: '[data-testid^="stock-"]',
    position: 'top',
    tip: 'Look for dotted underlines - they have helpful explanations'
  },
  {
    id: 'watchlist',
    title: '⭐ Building Your Watchlist',
    description: 'Click the star icon on any stock card to add it to your personal watchlist for tracking.',
    targetSelector: '[data-testid="watchlist-"]',
    position: 'left',
    action: 'Try adding a stock to your watchlist'
  },
  {
    id: 'learn-more',
    title: '📚 Learn More Sections',
    description: 'Each stock card has a "Learn About This Stock" button with educational content and investment tips.',
    targetSelector: '[data-tour="learn-more"]',
    position: 'top',
    action: 'Click to expand the learning section'
  },
  {
    id: 'search',
    title: '🔍 Smart Search',
    description: 'Use the search feature to quickly find specific stocks or explore by sector and keywords.',
    targetSelector: '[data-tour="search"]',
    position: 'bottom',
    tip: 'Pro tip: Use Ctrl+K for quick search access'
  },
  {
    id: 'help-center',
    title: '💡 Learning Center',
    description: 'The help button in the top bar opens our comprehensive Learning Center with tutorials and learning paths.',
    targetSelector: '[data-tour="help"]',
    position: 'bottom',
    action: 'Click the help icon to explore learning resources'
  },
  {
    id: 'complete',
    title: '🎉 You\'re Ready to Learn!',
    description: 'You\'ve completed the tour! Remember, this platform uses simulated data for safe learning. Explore, experiment, and learn at your own pace.',
    position: 'center',
    tip: 'Bookmark this platform for your ongoing financial education'
  }
];

interface EducationalTourProps {
  onComplete?: () => void;
  onSkip?: () => void;
  autoStart?: boolean;
}

export function EducationalTour({ onComplete, onSkip, autoStart = false }: EducationalTourProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Check if user has seen the tour before
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('stock-intel-tour-completed');
    if (autoStart && !hasSeenTour) {
      setTimeout(() => {
        setIsActive(true);
        setIsVisible(true);
      }, 1500); // Delay to let the page load
    }
  }, [autoStart]);

  const startTour = () => {
    setCurrentStep(0);
    setIsActive(true);
    setIsVisible(true);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    localStorage.setItem('stock-intel-tour-completed', 'true');
    setIsActive(false);
    setIsVisible(false);
    onSkip?.();
  };

  const completeTour = () => {
    localStorage.setItem('stock-intel-tour-completed', 'true');
    setIsActive(false);
    setIsVisible(false);
    onComplete?.();
  };

  const getCurrentStepData = () => tourSteps[currentStep];

  if (!isActive || !isVisible) return null;

  const step = getCurrentStepData();
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-[200]" />
      
      {/* Tour Content */}
      <div className="fixed inset-0 z-[201] pointer-events-none">
        <div className="relative h-full flex items-center justify-center p-4">
          {/* Tour Card */}
          <div className="pointer-events-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-border max-w-md w-full animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-card-foreground">Getting Started Tour</h3>
                    <p className="text-sm text-muted-foreground">
                      Step {currentStep + 1} of {tourSteps.length}
                    </p>
                  </div>
                </div>
                <button
                  onClick={skipTour}
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-card-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted/30 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <h4 className="text-xl font-bold text-card-foreground mb-3">
                {step.title}
              </h4>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                {step.description}
              </p>

              {step.action && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Try it out:
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    {step.action}
                  </p>
                </div>
              )}

              {step.tip && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      💡 Pro Tip:
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    {step.tip}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="p-6 pt-0">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={skipTour}
                    className="px-4 py-2 text-muted-foreground hover:text-card-foreground transition-colors"
                  >
                    Skip Tour
                  </button>
                  
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLastStep ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Complete
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Quick Tour Trigger Button Component
export function TourTrigger() {
  const [showTour, setShowTour] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowTour(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Play className="h-3.5 w-3.5" />
        Take Tour
      </button>
      
      {showTour && (
        <EducationalTour
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}
    </>
  );
}

// Welcome Banner for New Users
export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasSeenBanner = localStorage.getItem('stock-intel-welcome-banner-seen');
    if (!hasSeenBanner) {
      setIsVisible(true);
    }
  }, []);

  const dismissBanner = () => {
    localStorage.setItem('stock-intel-welcome-banner-seen', 'true');
    setIsVisible(false);
  };

  const startTour = () => {
    setShowTour(true);
    dismissBanner();
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0">
            <Play className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground mb-1">
              🎓 Welcome to Stock Intelligence Learning Platform!
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              New to stock market analysis? Take our quick 5-minute guided tour to learn how to navigate the platform and understand key financial concepts.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={startTour}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Play className="h-3.5 w-3.5" />
                Start Tour
              </button>
              
              <button
                onClick={dismissBanner}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-card-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
          
          <button
            onClick={dismissBanner}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-card-foreground flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showTour && (
        <EducationalTour
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
          autoStart={true}
        />
      )}
    </>
  );
}