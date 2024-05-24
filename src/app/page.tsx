import BannerSection from "@/components/home/BannerSection";
import Client from "@/components/home/ServicesCarouselSpacing";
import MeetUs from "@/components/home/MeetUs";
import Services from "@/components/home/Services";
import ClientCarouselSpacing from "@/components/home/ClientCarouselSpacing";
import Portfolio from "@/components/home/Portfolio";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <main>
      <BannerSection />
      <MeetUs />
      <Client />
      <Services />
      <ClientCarouselSpacing />
      <Portfolio />
      <Testimonials />
    </main>
  );
}
