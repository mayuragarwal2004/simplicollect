export function createQueryString(params, searchParams) {
 const newSearchParams = new URLSearchParams(searchParams?.toString())

 console.log('params', params)

 for (const [key, value] of Object.entries(params)) {
  console.log('Key', key)
  console.log('value', value)
  if (value === null || value === undefined) {
   newSearchParams.delete(key)
  } else {
   newSearchParams.set(key, String(value))
  }
 }

 return newSearchParams.toString()
}