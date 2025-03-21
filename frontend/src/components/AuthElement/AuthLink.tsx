import Link from 'next/link'

interface AuthLinkProps {
  text: string
  linkText: string
  href: string
}

export default function AuthLink({ text, linkText, href }: AuthLinkProps) {
  return (
    <div className="text-center pt-4 border-t border-border">
      <p className="text-muted-foreground">
        {text}{' '}
        <Link href={href} className="text-blue-500 font-medium hover:text-purple-500 transition-colors hover:underline">
          {linkText}
        </Link>
      </p>
    </div>
  )
}