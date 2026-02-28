import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Since I don't have radix-ui installed, I will make a simple version without Slot for now or install it. 
// Simpler version for now to avoid dependency hell without shadcn init

const buttonVariants = cva(
  "inline-flex items-center justify-center white-space-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 dark:bg-accent dark:text-primary dark:font-bold",
        destructive: "bg-red-500 text-white hover:bg-red-500/90",
        outline: "border border-border bg-card hover:bg-secondary/5 text-foreground",
        secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20",
        ghost: "hover:bg-secondary/10 text-secondary hover:text-primary dark:hover:text-white",
        link: "text-primary dark:text-accent underline-offset-4 hover:underline",
        premium: "bg-accent text-primary font-bold hover:bg-accent/90 shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
