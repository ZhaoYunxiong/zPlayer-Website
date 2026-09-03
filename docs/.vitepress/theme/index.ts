import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

let homeRevealObserver: IntersectionObserver | undefined

function setupHomeReveal(): void {
  homeRevealObserver?.disconnect()
  homeRevealObserver = undefined

  const sections = document.querySelectorAll<HTMLElement>('.zplayer-home-landing > section')

  if (!sections.length) {
    return
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  sections.forEach((section, index) => {
    section.style.setProperty('--zplayer-section-order', String(index))
  })

  if (reduceMotion || !('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'))
    return
  }

  homeRevealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px'
    }
  )

  sections.forEach((section) => homeRevealObserver?.observe(section))
}

function scheduleHomeReveal(): void {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(setupHomeReveal)
  })
}

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ router }) {
    if (typeof window === 'undefined') {
      return
    }

    scheduleHomeReveal()
    router.onAfterRouteChange = scheduleHomeReveal
  }
}

export default theme
