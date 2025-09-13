import AppInfoTooltip from "@/app/components/AppInfoTooltip";
import AppSeparator from "@/app/components/AppSeparator";

const subjectsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h1>Subjects</h1>
          <AppInfoTooltip content="A list of all registered subjects" />
        </div>
      </div>
      <AppSeparator />
    </div>
  );
};

export default subjectsPage;
