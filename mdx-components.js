import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme
import * as LucideIcons from 'lucide-react'
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
  FeaturesMap
} from './components'

// Get the default MDX components
const themeComponents = getThemeComponents()

// Merge components
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...components,
    ...LucideIcons,
    ...TechIcons,
    ...NextraComponents,
    Accordion,
    AccordionItem,
    Badge,
    Title,
    EndpointTitle,
    BlogCard,
    BlogAuthor,
    TemplateCard,
    FeaturesMap
  }
}