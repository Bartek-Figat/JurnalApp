import { Slot, Slottable } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'
import { tw } from '../helpers/tw'

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed opacity-100 select-none data-[active]:bg-primary/30 data-[active]:border data-[active]:border-primary data-[active]:hover:bg-primary/25',
	{
		variants: {
			variant: {
				default: 'bg-primary text-white hover:enabled:bg-opacity-80',
				destructive:
					'bg-destructive text-white hover:enabled:bg-destructive/90',
				outline:
					'border border-input border-secondary bg-transparent bg-black/0 hover:enabled:text-accent-foreground hover:enabled:bg-black/10',
				secondary:
					'bg-secondary text-secondary-foreground hover:enabled:bg-secondary/80 data-[active]:bg-primary/30 data-[active]:border data-[active]:border-primary data-[active]:hover:bg-primary/25',
				ghost:
					'hover:enabled:bg-secondary/50 hover:enabled:text-accent-foreground !p-0 !h-auto',
				link: 'text-primary underline-offset-4 hover:enabled:underline',
			},
			size: {
				default: 'h-14 px-8 py-4 rounded-md',
				sm: 'h-10 rounded-sm px-6 py-2',
				lg: 'h-12 rounded-sm px-8 py-3',
				icon: 'h-14 p-4 rounded-full',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
	active?: boolean
	icon?: any
	iconPosition?: 'left' | 'right'
	iconClassName?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = 'default',
			size,
			active,
			asChild = false,
			icon: Icon,
			iconPosition = 'left',
			iconClassName,
			children,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : 'button'
		const isString = typeof children === 'string'

		return (
			<Comp
				className={tw(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...(active ? { 'data-active': '' } : {})}
				{...props}
			>
				{Icon && iconPosition === 'left' && (
					<Icon className={tw('mr-2 h-5 w-5', iconClassName)} />
				)}

				<Slottable>
					{
						// If is string, we wrap it in a span to apply styles
						// (like in the lines variant)
						isString ? <span>{children}</span> : children
					}
				</Slottable>

				{Icon && iconPosition === 'right' && (
					<Icon className={tw('ml-2 h-5 w-5', iconClassName)} />
				)}
			</Comp>
		)
	},
)
Button.displayName = 'Button'

export { Button, buttonVariants }
