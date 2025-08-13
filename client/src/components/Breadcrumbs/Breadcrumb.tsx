import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { Slash } from 'lucide-react';

interface BreadcrumbProps {
  items: { name: string; link?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbProps) {
  return (
    <div className="mb-2 flex flex-col gap-1 sm:flex-row md:mb-6 md:gap-3 sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {items[items.length - 1].name}
      </h2>

      {items.length > 1 && <Breadcrumb className="pb-2 px-4">
        <BreadcrumbList>
          {items.map((item, index) => (
            <BreadcrumbItem key={index}>
              {item.link ? (
                <BreadcrumbLink asChild>
                  <Link
                    to={item.link}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-foreground font-semibold">
                  {item.name}
                </span>
              )}
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>}
    </div>
  );
}
