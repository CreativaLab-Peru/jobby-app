"use client"

import React from 'react';
import HeroSection from '@/components/uk/hero-section';
import EligibilitySection from '@/components/uk/eligibility-section';
import TestimonialsAndFaqSection from '@/components/uk/testimonials-and-faq-section';
import PricingAndStorySection from '@/components/uk/pricing-and-story-section';
import ContentSection from "@/components/uk/content-section";
import {PublicPageTransition} from "@/components/shared/public-page-transition";

const UkLandingScreen: React.FC = () => {
  return (
    // Estableciendo el fondo oscuro y el color de texto claro predeterminado
    <PublicPageTransition>
      <div className="min-h-screen">
        <HeroSection/>
        <EligibilitySection/>
        <ContentSection/>
        <TestimonialsAndFaqSection />
        <PricingAndStorySection/>
      </div>
    </PublicPageTransition>
  );
};

export default UkLandingScreen;
