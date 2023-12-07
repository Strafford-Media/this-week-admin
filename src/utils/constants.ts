export const USER_ROLE = 'user'
export const SUPER_USER_ROLE = 'superuser'

export const adSizes = [
  { label: '300w x 250h', value: '300x250' },
  { label: '300w x 600h', value: '300x600' },
  { label: '160w x 600h', value: '160x600' },
  { label: '728w x 90h', value: '728x90' },
  { label: '300w x 50h', value: '300x50' },
  { label: '320w x 50h', value: '320x50' },
]

export const adSizeDisplayMap = adSizes.reduce((map, item) => ({ ...map, [item.value]: item.label }), {})
