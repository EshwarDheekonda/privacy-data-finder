import { useRef, useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection, HeroSectionRef } from '@/components/HeroSection';
import { TrustSection } from '@/components/TrustSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { UseCasesSection } from '@/components/UseCasesSection';
import { FooterSection } from '@/components/FooterSection';

const Index = () => {
  const heroRef = useRef<HeroSectionRef>(null);
  const [renderStatus, setRenderStatus] = useState<string[]>([]);

  useEffect(() => {
    console.log("🏠 Index.tsx: Component mounting");
    setRenderStatus(prev => [...prev, "Index component mounted"]);
    
    // Test if CSS is loading
    const testElement = document.createElement('div');
    testElement.className = 'bg-primary text-primary-foreground';
    document.body.appendChild(testElement);
    const styles = window.getComputedStyle(testElement);
    console.log("🎨 CSS Test - Primary color:", styles.backgroundColor);
    document.body.removeChild(testElement);
    
    setRenderStatus(prev => [...prev, "CSS test completed"]);
  }, []);

  const handleGetStartedClick = () => {
    console.log("🔘 Get Started clicked");
    heroRef.current?.focusSearchInput();
  };

  console.log("🔄 Index.tsx: Rendering with status:", renderStatus);

  return (
    <div className="min-h-screen relative">
      {/* Debug overlay for Index component */}
      <div className="fixed bottom-0 right-0 z-40 bg-blue-500 text-white p-2 text-xs max-w-xs opacity-75">
        <div className="font-bold">Index Status:</div>
        {renderStatus.map((status, i) => (
          <div key={i}>{status}</div>
        ))}
      </div>
      
      {/* Fallback content in case components fail to render */}
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <h1 className="text-4xl font-bold text-center text-foreground mb-4">
              PrivacyGuard Debug Mode
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Testing component rendering...
            </p>
          </div>
        </div>
        
        {/* Try to render components with error boundaries */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-primary/20 p-4">
            <p className="text-sm text-muted-foreground mb-2">Header Component:</p>
            <Header onGetStartedClick={handleGetStartedClick} />
          </div>
          
          <div className="border-2 border-dashed border-primary/20 p-4">
            <p className="text-sm text-muted-foreground mb-2">Hero Section:</p>
            <HeroSection ref={heroRef} />
          </div>
          
          <div className="border-2 border-dashed border-primary/20 p-4">
            <p className="text-sm text-muted-foreground mb-2">Trust Section:</p>
            <TrustSection />
          </div>
          
          <div className="border-2 border-dashed border-primary/20 p-4">
            <p className="text-sm text-muted-foreground mb-2">How It Works:</p>
            <HowItWorksSection />
          </div>
          
          <div className="border-2 border-dashed border-primary/20 p-4">
            <p className="text-sm text-muted-foreground mb-2">Features:</p>
            <FeaturesSection />
          </div>
          
          <div className="border-2 border-dashed border-primary/20 p-4">
            <p className="text-sm text-muted-foreground mb-2">Use Cases:</p>
            <UseCasesSection onGetStartedClick={handleGetStartedClick} />
          </div>
          
          <div className="border-2 border-dashed border-primary/20 p-4">
            <p className="text-sm text-muted-foreground mb-2">Footer:</p>
            <FooterSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
