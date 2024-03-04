export function maskValue(value: string, mask: string): string {
  let i = 0
  let result = ''
  const cleanedValue = String(value).replace(/\D/g, '')

  for (let m = 0; m < mask.length; m++) {
    if (mask[m] === '9') {
      if (i < cleanedValue.length) {
        result += cleanedValue[i]
        i++
      } else {
        break
      }
    } else {
      if (mask[m] === cleanedValue[i]) {
        // Se o caractere da máscara coincide com o caractere no valor, avance no valor
        i++
      } else {
        // Se o caractere da máscara é diferente do caractere no valor, adicione o caractere da máscara
        result += mask[m]
      }
    }
  }

  return result
}
