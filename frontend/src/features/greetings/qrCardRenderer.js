const CARD_WIDTH = 1200
const CARD_HEIGHT = 1800

const createRoundedRectangle = (context, x, y, width, height, radius) => {
  const safeRadius = Math.min(radius, width / 2, height / 2)

  context.beginPath()
  context.moveTo(x + safeRadius, y)
  context.lineTo(x + width - safeRadius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius)
  context.lineTo(x + width, y + height - safeRadius)
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height)
  context.lineTo(x + safeRadius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius)
  context.lineTo(x, y + safeRadius)
  context.quadraticCurveTo(x, y, x + safeRadius, y)
  context.closePath()
}

const loadImage = (source) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Unable to prepare the QR card image'))
    image.src = source
  })
}

const drawHeart = (context, centerX, centerY, size, color) => {
  context.save()
  context.fillStyle = color
  context.beginPath()
  context.moveTo(centerX, centerY + size * 0.35)
  context.bezierCurveTo(
    centerX - size * 0.75,
    centerY - size * 0.15,
    centerX - size * 0.4,
    centerY - size * 0.75,
    centerX,
    centerY - size * 0.3
  )
  context.bezierCurveTo(
    centerX + size * 0.4,
    centerY - size * 0.75,
    centerX + size * 0.75,
    centerY - size * 0.15,
    centerX,
    centerY + size * 0.35
  )
  context.fill()
  context.restore()
}

const drawSparkle = (context, centerX, centerY, size, color) => {
  context.save()
  context.fillStyle = color
  context.beginPath()
  context.moveTo(centerX, centerY - size)
  context.lineTo(centerX + size * 0.25, centerY - size * 0.25)
  context.lineTo(centerX + size, centerY)
  context.lineTo(centerX + size * 0.25, centerY + size * 0.25)
  context.lineTo(centerX, centerY + size)
  context.lineTo(centerX - size * 0.25, centerY + size * 0.25)
  context.lineTo(centerX - size, centerY)
  context.lineTo(centerX - size * 0.25, centerY - size * 0.25)
  context.closePath()
  context.fill()
  context.restore()
}

const drawCakeMark = (context, centerX, top, visual) => {
  context.save()
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.lineWidth = 8
  context.strokeStyle = visual.primary
  context.fillStyle = visual.colors[0]

  context.beginPath()
  context.moveTo(centerX - 58, top + 70)
  context.lineTo(centerX + 58, top + 70)
  context.lineTo(centerX + 36, top)
  context.lineTo(centerX - 30, top)
  context.closePath()
  context.fill()
  context.stroke()

  context.beginPath()
  context.moveTo(centerX - 48, top + 42)
  context.bezierCurveTo(centerX - 24, top + 63, centerX - 2, top + 22, centerX + 22, top + 43)
  context.bezierCurveTo(centerX + 34, top + 53, centerX + 44, top + 50, centerX + 49, top + 43)
  context.stroke()

  drawHeart(context, centerX + 7, top - 12, 34, visual.primary)
  drawSparkle(context, centerX + 90, top + 5, 20, visual.colors[1])
  context.restore()
}

const getNameFontSize = (context, name) => {
  let fontSize = 78

  while (fontSize > 48) {
    context.font = `600 ${fontSize}px Georgia, serif`

    if (context.measureText(name).width <= 840) {
      return fontSize
    }

    fontSize -= 4
  }

  return fontSize
}

export const createThemedQrCard = async ({ greeting, qrImageUrl, visual }) => {
  const qrImage = await loadImage(qrImageUrl)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT

  context.fillStyle = visual.colors[0]
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  context.save()
  context.globalAlpha = 0.58
  context.fillStyle = visual.colors[1]
  context.beginPath()
  context.arc(45, 120, 245, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = visual.colors[2]
  context.beginPath()
  context.arc(1180, 1680, 310, 0, Math.PI * 2)
  context.fill()
  context.restore()

  createRoundedRectangle(context, 70, 70, 1060, 1660, 54)
  context.fillStyle = '#FFFEFC'
  context.fill()
  context.lineWidth = 5
  context.strokeStyle = visual.primary
  context.stroke()

  drawCakeMark(context, CARD_WIDTH / 2, 158, visual)

  context.textAlign = 'center'
  context.fillStyle = visual.ink
  context.font = '700 43px Arial, sans-serif'
  context.fillText('FROSTED WHISPERS', CARD_WIDTH / 2, 335)

  context.fillStyle = visual.primary
  context.font = '700 27px Arial, sans-serif'
  context.fillText(visual.label.toUpperCase(), CARD_WIDTH / 2, 395)

  context.fillStyle = visual.ink
  context.font = 'italic 40px Georgia, serif'
  context.fillText('A sweet surprise awaits', CARD_WIDTH / 2, 470)

  const qrFrameSize = 820
  const qrFrameX = (CARD_WIDTH - qrFrameSize) / 2
  const qrFrameY = 535
  createRoundedRectangle(context, qrFrameX, qrFrameY, qrFrameSize, qrFrameSize, 40)
  context.fillStyle = '#FFFFFF'
  context.fill()
  context.lineWidth = 4
  context.strokeStyle = visual.colors[1]
  context.stroke()

  const qrSize = 720
  const qrX = (CARD_WIDTH - qrSize) / 2
  const qrY = qrFrameY + 50
  context.drawImage(qrImage, qrX, qrY, qrSize, qrSize)

  drawSparkle(context, 175, 1430, 26, visual.colors[1])
  drawSparkle(context, 1025, 1430, 26, visual.colors[1])
  drawHeart(context, CARD_WIDTH / 2, 1422, 32, visual.primary)

  context.fillStyle = visual.ink
  context.font = '700 31px Arial, sans-serif'
  context.fillText('SCAN TO REVEAL YOUR MESSAGE', CARD_WIDTH / 2, 1510)

  context.fillStyle = visual.primary
  context.font = '700 24px Arial, sans-serif'
  context.fillText('ESPECIALLY FOR', CARD_WIDTH / 2, 1570)

  const nameFontSize = getNameFontSize(context, greeting.recipientName)
  context.fillStyle = visual.ink
  context.font = `600 ${nameFontSize}px Georgia, serif`
  context.fillText(greeting.recipientName, CARD_WIDTH / 2, 1640)

  context.fillStyle = '#78716C'
  context.font = 'italic 26px Georgia, serif'
  context.fillText('Every cake carries a message.', CARD_WIDTH / 2, 1695)

  return canvas.toDataURL('image/png')
}
