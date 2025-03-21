import type { SVGProps } from 'react'

const SiteLogoWithoutText = (props: SVGProps<SVGSVGElement>) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		width="40"
		height="40"
		viewBox="0 0 40 40"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M35.5556 0H4.44444C2 0 0 2 0 4.44444V35.5556C0 38 2 40 4.44444 40H35.5556C38 40 40 38 40 35.5556V4.44444C40 2 38 0 35.5556 0ZM13.3333 31.1111H8.88889V15.5556H13.3333V31.1111ZM22.2222 31.1111H17.7778V8.88889H22.2222V31.1111ZM31.1111 31.1111H26.6667V22.2222H31.1111V31.1111Z"
			fill="#0052CC"
		/>
	</svg>
)

export default SiteLogoWithoutText
