import ProjectListingPage from "@/components/property/ProjectListingPage";

export default function ResidentialPage() {
  return (
    <ProjectListingPage
      title="Properties in Ahmedabad"
      endpoint="/properties/residential/"
      category="residential"
    />
  );
}
