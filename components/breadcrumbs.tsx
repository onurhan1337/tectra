"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbsProps {
  pathname?: string;
}

export function PageBreadcrumbs({
  pathname: propPathname,
}: PageBreadcrumbsProps) {
  const hookPathname = usePathname();
  const pathname = propPathname || hookPathname;

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: "Dashboard", href: "/dashboard" },
    ];

    if (!pathname || pathname === "/dashboard") {
      return items;
    }

    const pathSegments = pathname.split("/").filter(Boolean);

    let currentPath = "";

    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;

      if (pathSegments[i] === "dashboard") continue;

      if (i === pathSegments.length - 1) {
        items.push({
          label: capitalizeFirstLetter(pathSegments[i].replace(/-/g, " ")),
        });
      } else {
        items.push({
          label: capitalizeFirstLetter(pathSegments[i].replace(/-/g, " ")),
          href: currentPath,
        });
      }
    }

    return items;
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <Fragment key={`item-${index}`}>
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator
                key={`sep-${index}`}
                className="hidden md:block"
              />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
