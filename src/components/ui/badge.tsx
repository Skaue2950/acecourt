import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-ace-bg',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-emerald-500/20 text-emerald-300',
        secondary: 'border-transparent bg-gray-700 text-gray-200',
        destructive: 'border-transparent bg-red-500/20 text-red-300',
        outline: 'text-foreground border-gray-600',
        success: 'border-transparent bg-green-500/20 text-green-300',
        warning: 'border-transparent bg-yellow-500/20 text-yellow-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
