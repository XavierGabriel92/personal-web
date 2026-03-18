import { TypographySpan } from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import { Link, useLocation } from '@tanstack/react-router'
import { HistoryIcon, HomeIcon, User } from 'lucide-react'

const routes = [
  {
    path: '/client/home',
    label: 'Home',
    icon: <HomeIcon />,
  },
  {
    path: '/client/history',
    label: 'Histórico',
    icon: <HistoryIcon />,
  },
  {
    path: '/client/profile',
    label: 'Perfil',
    icon: <User />,
  },
]

export default function ClientNavBar() {
  const location = useLocation()

  return (
    <nav className="sticky bottom-0 left-0 z-50 flex shrink-0 items-center justify-around pb-4 pt-2 border-t bg-background">
      {routes.map((route) => {

        const isActive =
          location.pathname === route.path ||
          location.pathname.startsWith(`${route.path}/`);

        return <Link key={route.path} to={route.path} className="flex flex-col items-center justify-center gap-1">

          <TypographySpan className={cn(
            isActive ? 'text-primary' : 'text-gray-500',
            'text-sm flex flex-col items-center justify-center gap-1'
          )}>{route.icon}
            {route.label}</TypographySpan>
        </Link>

      })}
    </nav>
  )
}