import React, { ReactElement } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Utility function to format breadcrumb text
const formatBreadcrumbText = (text: string): string => {
  // Split camelCase into separate words and capitalize each word
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
    .replace(/_/g, " ") // Replace underscores with spaces
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join words back into a single string
};

export function Breadcrumbs({ routes = [] }: { routes: string[] }) {
  let fullHref: string | undefined = undefined;
  const breadcrumbItems: ReactElement[] = [];
  let breadcrumbPage: ReactElement = <></>;

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    let href;

    href = fullHref ? `${fullHref}/${route}` : `/${route}`;
    fullHref = href;

    if (i === routes.length - 1) {
      breadcrumbPage = (
        <BreadcrumbItem>
          <BreadcrumbPage>{formatBreadcrumbText(route)}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      breadcrumbItems.push(
        <React.Fragment key={href}>
          <BreadcrumbItem className={i < 2 ? "hidden" : ""}>
            <BreadcrumbLink href={href}>
              {formatBreadcrumbText(route)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </React.Fragment>
      );
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems}
        <BreadcrumbSeparator className={routes.length < 4 ? "hidden" : ""} />
        {breadcrumbPage}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
