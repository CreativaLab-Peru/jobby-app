"use client"

import React, {useRef} from 'react';

import HeroSection from '@/components/uk/hero-section';
import EligibilitySection from '@/components/uk/eligibility-section';
import TestimonialsAndFaqSection from '@/components/uk/testimonials-and-faq-section';
import PricingAndStorySection from '@/components/uk/pricing-and-story-section';
import ContentSection from "@/components/uk/content-section";
import {PublicPageTransition} from "@/components/shared/public-page-transition";

const URL_TO_REDIRECT = 'https://pay.hotmart.com/C105490389E'

const UkLandingScreen: React.FC = () => {

  const pricingRef = useRef<HTMLDivElement>(null);

  // 3. Función para ejecutar el scroll
  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start' // Alinea al inicio de la sección
    });
  };

  const newTabToPay = () => {
    window.open(URL_TO_REDIRECT, '_blank');
  }

  return (
    // Estableciendo el fondo oscuro y el color de texto claro predeterminado
    <PublicPageTransition>
      <div className="min-h-screen">
        <HeroSection/>
        {/* 4. Pasamos la función de scroll a la sección donde está el botón */}
        <EligibilitySection onActionClick={scrollToPricing}/>
        <ContentSection/>
        <TestimonialsAndFaqSection/>
        {/* 5. Pasamos la ref a la sección de destino */}
        <PricingAndStorySection
          forwardRef={pricingRef}
          onActionClick={scrollToPricing}
          onPayRedirect={newTabToPay}
        />
      </div>
    </PublicPageTransition>
  );
};

export default UkLandingScreen;
