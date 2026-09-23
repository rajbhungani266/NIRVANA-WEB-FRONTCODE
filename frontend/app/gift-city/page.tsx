import ProjectListingPage from "@/components/property/ProjectListingPage";
import GiftCityEnquiryForm from "@/components/property/GiftCityEnquiryForm";

export default function GiftCityPage() {
  return (
    <ProjectListingPage
      title="GIFT City Properties"
      endpoint="/properties/gift-city/"
      category="gift-city"
      sidebarForm={<GiftCityEnquiryForm />}
    />
  );
}
