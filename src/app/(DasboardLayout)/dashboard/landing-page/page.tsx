import FAQ from "./_components/FAQ";
import Hero from "./_components/Hero";
import HowItWork from "./_components/HowItWorks";
import OurStory from "./_components/OurStory";
import WhatYouGet from "./_components/WhatYouGet";

const page = () => {
  return (
    <div>
      <Hero />
      <HowItWork />
      <WhatYouGet />
      <OurStory />
      <FAQ />
    </div>
  );
};

export default page;
