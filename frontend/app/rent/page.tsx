import ProjectListingPage from "@/components/property/ProjectListingPage";

export default function RentPage() {
  return (
    <ProjectListingPage
      title="Properties for Rent in Ahmedabad"
      endpoint="/properties/rent/"
      category="rent"
      defaultQuery="?deal_type=rental"
    />
  );
}
