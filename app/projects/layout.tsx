import { Suspense } from "react";
import { ProjectHeader } from "../components/project-header";
import { ProjectFooter } from "../components/project-footer";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="blank-project-page"><Suspense><ProjectHeader /></Suspense>{children}</div>
      <Suspense><ProjectFooter /></Suspense>
    </>
  );
}
