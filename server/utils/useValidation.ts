import { z } from 'zod';

const logger = useLogger('useValidation');

/**
 * Composable validation function that throws an error if the data does not match the schema.
 *
 * @param {z.Schema} schema - The schema to validate against.
 * @param {T} data - The data to validate.
 * @returns {T} The validated data.
 */
export default function useValidation<T = unknown>(schema: z.Schema, data: T): T {
  logger.debug('Validating data against schema', { schema, data });
  const parsed = schema.safeParse(data);

  if (parsed.success) return parsed.data;
  else {
    throw createError({
      status: 422,
      statusMessage: 'Unprocessable entity',
      message: 'The provided data was incomplete or invalid.',
      data: parsed.error.errors.map(({ code, path, message }) => ({
        type: code,
        path,
        message,
      })),
    });
  }
}
