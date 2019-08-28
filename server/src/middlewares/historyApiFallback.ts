import { Context, Middleware } from 'koa';

/**
 * Understand why this middleware is necessary :
 * https://github.com/bripkens/connect-history-api-fallback
 */
export function historyApiFallback(options: object = {}): Middleware {
  /**
   * return koa middleware function
   */
  return async(ctx: Context, next: Function): Promise<void> => {

    /* tslint:disable */
    const headers: any = ctx.headers;

    if (ctx.method !== 'GET') {
      return next(); // not rewriting because the method is not GET.
    } else if (!headers || typeof headers.accept !== 'string') {
      return next(); // not rewriting because the client did not send an HTTP accept header.
    } else if (headers.accept.indexOf('application/json') === 0) {
      return next(); // not rewriting because the client prefers JSON.
    } else if (!acceptsHtml(headers.accept, options)) {
      return next(); // not rewriting because the client does not accept HTML.
    } else if (ctx.url.lastIndexOf('.') > ctx.url.lastIndexOf('/')) {
      return next(); // not rewriting because the path includes a dot (.) character.
    } else if (ctx.url === '/') {
      return next(); // not rewriting because it is the entry point.
    }

    ctx.url = '/index.html';
    return next();
  };
}

/**
 * return true if client accept html
 */
function acceptsHtml(header: any, options: any): boolean {
  options.htmlAcceptHeaders = options.htmlAcceptHeaders || ['text/html', '*/*'];

  for (let i = 0; i < options.htmlAcceptHeaders.length; i++) {
    if (header.indexOf(options.htmlAcceptHeaders[i]) !== -1) {
      return true;
    }
  }

  return false;
}
