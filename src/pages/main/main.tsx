import Navigation from "./navigation";
import Hero from "./hero";
import About from "./about";
import Snapshot from "./snopshot";
import FeatureSectionsRight from "./featureSectionsRight";
import FeatureSectionsLeft from "./featureSectionsLeft";
import TradingExperience from "./tradingExperience";
import Testimonials from "./testimonials";
import Pricing from "./pricing";
import FAQ from "./faqs";
import Footer from "./footer";

function MainPage() {
  return (
    <div>
      <Navigation />
      <Hero />
      <About />
      <Snapshot />
      <div className="relative">
        <FeatureSectionsRight />
        <img
          src="https://s3-alpha-sig.figma.com/img/75e8/c230/4c87f6892ceea4227528d3e5b643bd83?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ikj4N-6eqSGfA5GZhHpftcF6YihJdLTy5w8qof17V1u7q0noXEe1ofsz6Ik7i9tJpw~0GWNtZC49tdLdxkCNsIcwH8~A0Gn-9Op4SfTd2s5n3rotX0gMx3QOzdS22A7AyJpR8HDEP2hPhBL16ocMhYRpmTOrfycs5E2AzrsVmdjBFfKOD~yOlRXYkd5XOLoyLjvE00DVUo-cw85eyX48~-oGcoKU-ilqqzpalirteMPXR2QNGaar1iCYjulaxLHaOb6Iu~H3x4iWzYEYllWJ~YDb56yaUowGJDSHPpJgwC7~IrReKqPOIo617GRDhBxkpfPTpPHmfJYXaPGDQ~RpZQ__"
          alt=""
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 transform opacity-10"
        />
        <FeatureSectionsLeft />
      </div>
      <TradingExperience />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

export default MainPage;
