import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { useTheme } from 'next-themes'
import { Cloud, fetchSimpleIcons, renderSimpleIcon, type ICloud, type SimpleIcon } from 'react-icon-cloud'

export const cloudProps: Omit<ICloud, 'children'> = {
  containerProps: { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: 780, height: 320, paddingTop: 0, margin: '0 auto', overflow: 'hidden' } },
  options: {
    reverse: true, depth: 0.9, wheelZoom: false, imageScale: 2, activeCursor: 'default', tooltip: 'native',
    initial: [0.1, -0.1], clickToFront: 500, tooltipDelay: 0, outlineColour: '#0000', maxSpeed: 0.025, minSpeed: 0.01,
  },
}

export type DynamicCloudProps = { iconSlugs: string[] }
type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>

export function IconCloud({ iconSlugs }: DynamicCloudProps) {
  const [data, setData] = useState<IconData | null>(null)
  const { resolvedTheme } = useTheme()
  const slugKey = iconSlugs.join(',')
  useEffect(() => {
    let mounted = true
    fetchSimpleIcons({ slugs: slugKey.split(',') }).then((result) => { if (mounted) setData(result) }).catch(() => { if (mounted) setData(null) })
    return () => { mounted = false }
  }, [slugKey])

  const renderedIcons = useMemo(() => {
    if (!data) return null
    const theme = resolvedTheme === 'dark' ? 'dark' : 'light'
    const bgHex = theme === 'light' ? '#ffffff' : '#0d1b2b'
    const fallbackHex = theme === 'light' ? '#31516b' : '#ffffff'
    return Object.values(data.simpleIcons).map((icon: SimpleIcon) => renderSimpleIcon({
      icon, bgHex, fallbackHex, minContrastRatio: 3, size: 68,
      aProps: { href: undefined, target: undefined, rel: undefined, onClick: (event: MouseEvent) => event.preventDefault() },
    }))
  }, [data, resolvedTheme])

  return <div className="sky-icon-cloud" aria-label="Airline partners"><>{renderedIcons ? <Cloud {...cloudProps}><>{renderedIcons}</></Cloud> : <div className="partner-fallback">{iconSlugs.map((slug) => <span key={slug}>{slug.replace(/([a-z])([A-Z])/g, '$1 $2')}</span>)}</div>}</></div>
}
