import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'
import { Logo } from '../icons/Logo'
import { ScopedSearch } from '../components/search/ScopedSearch'
import { getReleases, releaseHref } from '../components/changelog/releases'

export const metadata = {
  title: 'BSH Solutions',
  description: 'BSH Solutions Documentation',
  icons: {
    icon: '/favicon.ico',
  }
}

async function ReleaseBanner() {
  const [newest] = await getReleases()
  if (!newest) return null
  return (
    <Banner storageKey={`${newest.version}-release`}>
      <a href={releaseHref(newest.version)}>
        {newest.date
          ? `🎉 BSH Engine v${newest.version} is out with new features and improvements. See what's new →`
          : `🚀 BSH Engine v${newest.version} is coming soon. See what's new →`}
      </a>
    </Banner>
  )
}

const navbar = (
  <Navbar
    logo={<Logo />}
  />
)
const footer = <Footer>
  <div >
    <span>
      © {new Date().getFullYear()} | Licensed under MIT. Crafted with care by
      <a href="https://docs.bousalih.com" target="_blank" style={{ color: '#0077b5', marginLeft: '0.5rem' }}>
        BSH Solutions</a>. Founded by
      <a href="https://hamza.bousalih.com" target="_blank" style={{ color: '#0077b5', marginLeft: '0.5rem' }}>
        Bousalih Hamza</a>.
    </span>
  </div>
</Footer>

export default async function RootLayout({ children }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
    >
      <Head color={{ hue: 201, saturation: 100, lightness: { light: 35, dark: 55 } }} />
      <body>
        <Layout
          banner={<ReleaseBanner />}
          navbar={navbar}
          search={<ScopedSearch />}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/bsh-devsolutions/documentation"
          footer={footer}
          editLink={null}
          feedback={{ content: null }}
          navigation={{
            prev: true,
            next: true
          }}
          sidebar={{
            autoCollapse: true,
            defaultMenuCollapseLevel: 1,
            defaultOpen: true,
            toggleButton: true,
          }}
          toc={{
            backToTop: <>Scroll to top</>,
            float: true,
            title: 'Sections',
          }}
        >
          {children}
        </Layout>
        <noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true" alt="" referrerPolicy="no-referrer-when-downgrade" /></noscript>
      </body>
    </html>
  )
}