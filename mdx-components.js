import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme
// Only the lucide icons used in MDX pages — add new ones here when a page needs them
import {
  BoltIcon,
  BookTypeIcon,
  Building2,
  DatabaseIcon,
  FileTextIcon,
  ImageIcon,
  KeyIcon,
  KeyRoundIcon,
  LogInIcon,
  MailIcon,
  MonitorSmartphoneIcon,
  RectangleEllipsisIcon,
  ShieldCheckIcon,
  ShieldIcon,
  TypeOutlineIcon,
  UserCheckIcon,
  UserPlusIcon,
  UsersIcon
} from 'lucide-react'
import * as TechIcons from './tech-icons'
import * as NextraComponents from 'nextra/components'
import {
  Accordion,
  AccordionItem,
  Badge,
  Title,
  EndpointTitle,
  BlogCard,
  BlogAuthor,
  TemplateCard,
  FeaturesMap,
  ConfigComponent
} from './components'
import { createSearchWrapper } from './components/search/search-wrapper'

// Get the default MDX components
const themeComponents = getThemeComponents()

const Wrapper = createSearchWrapper(themeComponents.wrapper)

// Card grids only link to other pages — keep their text out of search results
const { Cards } = NextraComponents
const SearchIgnoredCards = Object.assign((props) => <Cards data-pagefind-ignore="all" {...props} />, { Card: Cards.Card })

const LucideIcons = {
  BoltIcon,
  BookTypeIcon,
  Building2,
  DatabaseIcon,
  FileTextIcon,
  ImageIcon,
  KeyIcon,
  KeyRoundIcon,
  LogInIcon,
  MailIcon,
  MonitorSmartphoneIcon,
  RectangleEllipsisIcon,
  ShieldCheckIcon,
  ShieldIcon,
  TypeOutlineIcon,
  UserCheckIcon,
  UserPlusIcon,
  UsersIcon
}

// Merge components — `components` goes last so page-level overrides win
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...LucideIcons,
    ...TechIcons,
    ...NextraComponents,
    Cards: SearchIgnoredCards,
    Accordion,
    AccordionItem,
    Badge,
    Title,
    EndpointTitle,
    BlogCard,
    BlogAuthor,
    TemplateCard,
    FeaturesMap,
    ConfigComponent,
    wrapper: Wrapper,
    ...components
  }
}
