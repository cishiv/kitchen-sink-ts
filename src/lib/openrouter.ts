import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateObject, generateText } from 'ai'
import type { LanguageModel } from 'ai'
import type { z } from 'zod'

const FALLBACK_DEFAULT_MODEL = 'anthropic/claude-sonnet-4.5'

type OpenRouterClient = ReturnType<typeof createOpenRouter>

let cached: OpenRouterClient | null = null

const requireEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) throw new Error(`${key} is not set`)
  return value
}

const getOpenRouter = (): OpenRouterClient => {
  if (cached) return cached
  cached = createOpenRouter({ apiKey: requireEnv('OPENROUTER_API_KEY') })
  return cached
}

export const openrouter = new Proxy({} as OpenRouterClient, {
  get: (_, prop, receiver) => Reflect.get(getOpenRouter(), prop, receiver),
  apply: (_, thisArg, args) => Reflect.apply(getOpenRouter() as never, thisArg, args),
})

export const getDefaultModelId = (): string => {
  return process.env.OPENROUTER_DEFAULT_MODEL || FALLBACK_DEFAULT_MODEL
}

export const getModel = (modelId?: string): LanguageModel => {
  return getOpenRouter().chat(modelId || getDefaultModelId())
}

export type CompleteParams = {
  prompt: string
  model?: string
  system?: string
  temperature?: number
  maxOutputTokens?: number
}

export type CompleteResult = {
  text: string
  modelId: string
}

export const complete = async (
  params: CompleteParams,
): Promise<CompleteResult> => {
  const modelId = params.model || getDefaultModelId()
  const { text } = await generateText({
    model: getModel(modelId),
    prompt: params.prompt,
    system: params.system,
    temperature: params.temperature,
    maxOutputTokens: params.maxOutputTokens,
  })
  return { text, modelId }
}

export type CompleteStructuredParams<T> = {
  prompt: string
  schema: z.ZodType<T>
  model?: string
  system?: string
  temperature?: number
  maxOutputTokens?: number
}

export type CompleteStructuredResult<T> = {
  object: T
  modelId: string
}

export const completeStructured = async <T>(
  params: CompleteStructuredParams<T>,
): Promise<CompleteStructuredResult<T>> => {
  const modelId = params.model || getDefaultModelId()
  const { object } = await generateObject({
    model: getModel(modelId),
    schema: params.schema,
    prompt: params.prompt,
    system: params.system,
    temperature: params.temperature,
    maxOutputTokens: params.maxOutputTokens,
  })
  return { object: object as T, modelId }
}
