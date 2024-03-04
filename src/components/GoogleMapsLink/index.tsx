interface GoogleMapsLinkProps {
  title: string
  latitude: number
  longitude: number
}

export function GoogleMapsLink({
  title,
  latitude,
  longitude,
}: GoogleMapsLinkProps) {
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`

  return (
    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
      {title}
    </a>
  )
}
