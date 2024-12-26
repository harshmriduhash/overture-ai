"use client";

import LandingHero from "@/components/landing/hero";
import LandingNavbar from "@/components/landing/navbar";
import LandingBanner from "@/components/landing/banner";
import LandingFeature from "@/components/landing/feature";
import LandingPricing from "@/components/landing/pricing";
import LandingContact from "@/components/landing/contact";
import LandingFooter from "@/components/landing/footer";
import LandingNavbarMobile from "@/components/landing/navbar-mobile";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-y-auto">
      <section id="home">
        <LandingNavbar />
        <LandingNavbarMobile />
      </section>
      <section id="hero">
        <LandingHero />
      </section>
      <section id="banner">
        <LandingBanner />
      </section>
      <section id="features">
        <LandingFeature />
      </section>
      <section id="pricing">
        <LandingPricing />
      </section>
      <section id="contact">
        <LandingContact />
      </section>
      <section id="footer">
        <LandingFooter />
      </section>
    </div>
  );
}
