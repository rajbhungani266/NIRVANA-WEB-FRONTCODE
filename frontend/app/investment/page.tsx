import ProjectListingPage from "@/components/property/ProjectListingPage";
import InvestmentEnquiryForm from "@/components/property/InvestmentEnquiryForm";

export default function InvestmentPage() {
  return (
    <ProjectListingPage
      title="Investment Properties in Ahmedabad"
      endpoint="/properties/investment/"
      category="investment"
      sidebarForm={<InvestmentEnquiryForm />}
    />
  );
}
