export const getLogoUrl = (domain) => {
  if (!domain) return null
  if (domain === 'intellibuild-labs.com') return 'https://intellibuild-labs.com/favicon.png'
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}
