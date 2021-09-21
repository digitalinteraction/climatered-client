import { LocalisedContent } from './api-types'

export function delocalise(
  object: LocalisedContent,
  ...locales: string[]
): string | undefined {
  for (const locale of locales) {
    if (object[locale]) return object[locale]
  }
  return object.en
}
