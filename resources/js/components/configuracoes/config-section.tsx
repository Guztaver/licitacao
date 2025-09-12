import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfigSectionProps {
    title: string;
    description: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

export default function ConfigSection({ title, description, icon: Icon, children }: ConfigSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Icon className="mr-2 h-5 w-5" />
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
}
