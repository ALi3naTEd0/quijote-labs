import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Sancho from "@/components/Sancho";
import Analogy from "@/components/Analogy";
import Differentiator from "@/components/Differentiator";
import Pricing from "@/components/Pricing";
import PreDiagnosis from "@/components/PreDiagnosis";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Sancho />
        <Analogy />
        <Differentiator />
        <Pricing />
        <PreDiagnosis />
        <CTA />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
