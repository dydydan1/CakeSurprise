import {
  createGreeting,
  generateGreetingQrAccess,
  getGreeting,
  getPublicGreeting,
  listGreetings,
  updateGreeting
} from '../services/greetingService.js'
import {
  createGreetingSchema,
  greetingIdSchema,
  greetingListSchema,
  greetingTokenSchema,
  updateGreetingSchema
} from '../validations/greetingValidation.js'

const sendValidationError = (response) => {
  return response.status(400).json({
    message: 'Greeting information is invalid'
  })
}

const sendOwnerAccessRequired = (response) => {
  return response.status(403).json({
    message: 'Owner access is required to archive or restore greetings'
  })
}

const isRestrictedArchiveChange = (adminRole, currentStatus, nextStatus) => {
  if (adminRole === 'owner' || !nextStatus || nextStatus === currentStatus) {
    return false
  }

  return currentStatus === 'archived' || nextStatus === 'archived'
}

export const createGreetingHandler = async (request, response, next) => {
  try {
    const validationResult = createGreetingSchema.safeParse(request.body)

    if (!validationResult.success) {
      return sendValidationError(response)
    }

    if (isRestrictedArchiveChange(
      request.admin.role,
      null,
      validationResult.data.status
    )) {
      return sendOwnerAccessRequired(response)
    }

    const greeting = await createGreeting(validationResult.data, request.admin.id)
    return response.status(201).json({ greeting })
  } catch (error) {
    return next(error)
  }
}

export const listGreetingsHandler = async (request, response, next) => {
  try {
    const validationResult = greetingListSchema.safeParse(request.query)

    if (!validationResult.success) {
      return sendValidationError(response)
    }

    const result = await listGreetings(validationResult.data)
    return response.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}

export const getGreetingHandler = async (request, response, next) => {
  try {
    const idResult = greetingIdSchema.safeParse(request.params.id)

    if (!idResult.success) {
      return sendValidationError(response)
    }

    const greeting = await getGreeting(idResult.data)

    if (!greeting) {
      return response.status(404).json({
        message: 'Greeting not found'
      })
    }

    return response.status(200).json({ greeting })
  } catch (error) {
    return next(error)
  }
}

export const updateGreetingHandler = async (request, response, next) => {
  try {
    const idResult = greetingIdSchema.safeParse(request.params.id)
    const validationResult = updateGreetingSchema.safeParse(request.body)

    if (!idResult.success || !validationResult.success) {
      return sendValidationError(response)
    }

    const existingGreeting = await getGreeting(idResult.data)

    if (!existingGreeting) {
      return response.status(404).json({
        message: 'Greeting not found'
      })
    }

    if (isRestrictedArchiveChange(
      request.admin.role,
      existingGreeting.status,
      validationResult.data.status
    )) {
      return sendOwnerAccessRequired(response)
    }

    const greeting = await updateGreeting(idResult.data, validationResult.data)

    if (!greeting) {
      return response.status(404).json({
        message: 'Greeting not found'
      })
    }

    return response.status(200).json({ greeting })
  } catch (error) {
    return next(error)
  }
}

export const generateGreetingQrHandler = async (request, response, next) => {
  try {
    const idResult = greetingIdSchema.safeParse(request.params.id)

    if (!idResult.success) {
      return sendValidationError(response)
    }

    const result = await generateGreetingQrAccess(idResult.data)

    if (result.reason === 'not_found') {
      return response.status(404).json({ message: 'Greeting not found' })
    }

    if (result.reason === 'not_active') {
      return response.status(409).json({
        message: 'Activate the greeting before generating its QR code'
      })
    }

    return response.status(200).json({ greeting: result.greeting })
  } catch (error) {
    return next(error)
  }
}

export const getPublicGreetingHandler = async (request, response, next) => {
  try {
    const tokenResult = greetingTokenSchema.safeParse(request.params.token)

    if (!tokenResult.success) {
      return response.status(404).json({ message: 'Greeting not found' })
    }

    const greeting = await getPublicGreeting(tokenResult.data)

    if (!greeting) {
      return response.status(404).json({ message: 'Greeting not found' })
    }

    return response.status(200).json({ greeting })
  } catch (error) {
    return next(error)
  }
}
