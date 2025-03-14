import { useMemo } from 'react'
import { useIsClient, useTernaryDarkMode } from 'usehooks-ts'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const { isDarkMode } = useTernaryDarkMode()
	const isClient = useIsClient()

	const theme = useMemo(() => {
		return isDarkMode ? 'dark' : 'default'
	}, [isDarkMode])

	return (
		<div id="theme_wrapper" data-theme={isClient ? theme : 'default'}>
			{children}
		</div>
	)
}
