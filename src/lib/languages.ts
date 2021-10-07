import languagesData from '@/data/languages.json'
import { deepSeal, SelectOption } from '@openlab/deconf-ui-toolkit'

export function getLanguageOptions(): SelectOption[] {
  return deepSeal(
    Object.entries(languagesData).map(([value, text]) => ({ value, text }))
  )
}
