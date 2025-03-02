export function createQueryString(params, searchParams) {
 const newSearchParams = new URLSearchParams(searchParams?.toString())

 for (const [key, value] of Object.entries(params)) {
  if (value === null || value === undefined) {
   newSearchParams.delete(key)
  } else {
   newSearchParams.set(key, String(value))
  }
 }

 return newSearchParams.toString()
}