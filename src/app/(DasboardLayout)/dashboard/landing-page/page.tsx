import CTA from "./_components/CTA";
import FAQ from "./_components/FAQ";
import Hero from "./_components/Hero";
import HowItWork from "./_components/HowItWorks";
import OurStory from "./_components/OurStory";
import WhatYouGet from "./_components/WhatYouGet";

const page = () => {
  return (
    <div className="my-10">
      <Hero />
      <HowItWork />
      <WhatYouGet />
      <OurStory />
      <FAQ />
      <CTA />
    </div>
  );
};

export default page;
