import ProjectListingPage from "@/components/property/ProjectListingPage";

export default function CommercialPage() {
  return (
    <ProjectListingPage
      title="Commercial Properties in Ahmedabad"
      endpoint="/properties/commercial/"
      category="commercial"
    />
  );
}
