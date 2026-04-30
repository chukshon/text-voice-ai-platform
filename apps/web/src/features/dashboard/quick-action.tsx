import { DASHBOARD_QUICK_ACTIONS } from "@/constants";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const QuickActionSection = () => {
  return (
    <>
      <h2 className="mb-4 text-sm font-medium text-muted-foreground">Quick Actions</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DASHBOARD_QUICK_ACTIONS.map(({ title, description, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="transition-colors hover:border-border hover:bg-foreground/[0.02]">
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-foreground/[0.08]">
                  <Icon className="size-5 text-foreground" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default QuickActionSection;
