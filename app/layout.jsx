import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { Logo } from '../icons/Logo'

export const metadata = {
  title: 'BSH Solutions',
  description: 'BSH Solutions Documentation',
  icons: {
    icon: '/favicon.ico',
  }
}

const banner = <Banner storageKey="0.0.5-release">
<a href="/docs/bsh-engine/changelog#005---12-apr-2026">
  🎉 New release with new features and improvements! V0.0.5 Release →
</a>
</Banner>

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
      <Head>
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/bsh-devsolutions/documentation"
          footer={footer}
          editLink={null}
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
        <script data-collect-dnt="true" async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
        <noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true" alt="" referrerPolicy="no-referrer-when-downgrade" /></noscript>
      </body>
    </html>
  )
}