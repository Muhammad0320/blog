// This is called declaration merging!
declare global {
  namespace Express {
    export interface Request {
      postId?: number;
    }
  }
}
