import { Prisma } from '@prisma/client';
import { AppError } from '@/types/error-types';
import { ApplicationError } from './error-server-class';
import { getErrorMessage, SupportedLanguage } from '@/lib/i18n';
import { auth } from '@/lib/auth';

export async function handleServerError(error: unknown): Promise<AppError> {
  console.error('Error occurred:', error);

  // Get the user's language setting from session
  let language: SupportedLanguage = 'ja';
  try {
    const session = await auth();
    if (session?.user?.language) {
      language = session.user.language as SupportedLanguage;
    }
  } catch {
    // Use default language
  }

  if (error instanceof ApplicationError) {
    return {
      status: error.status,
      messageKey: error.messageKey,
      message: getErrorMessage(error.messageKey, language),
      details: error.details,
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma's general error handling
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        return {
          status: 'BAD_REQUEST',
          messageKey: 'RECORD_ALREADY_EXISTS',
          message: getErrorMessage('RECORD_ALREADY_EXISTS', language),
          details: { fields: error.meta?.target }
        };
      case 'P2025': // Record not found
        return {
          status: 'NOT_FOUND',
          messageKey: 'RESOURCE_NOT_FOUND',
          message: getErrorMessage('RESOURCE_NOT_FOUND', language),
          details: { error: error.message }
        };
      default:
        return {
          status: 'INTERNAL_ERROR',
          messageKey: 'DATABASE_ERROR',
          message: getErrorMessage('DATABASE_ERROR', language),
          details: { code: error.code, error: error.message }
        };
    }
  }

  if (error instanceof Error) {
    return {
      status: 'INTERNAL_ERROR',
      messageKey: 'INTERNAL_ERROR',
      message: getErrorMessage('INTERNAL_ERROR', language),
      details: { originalError: error.message }
    };
  }

  return {
    status: 'INTERNAL_ERROR',
    messageKey: 'INTERNAL_ERROR',
    message: getErrorMessage('INTERNAL_ERROR', language)
  };
}

export function createErrorResponse(error: AppError): Response {
  const statusCodes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
  };

  return Response.json(error, { 
    status: statusCodes[error.status],
    headers: {
      'Content-Type': 'application/json',
    }
  });
} 