'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
  getDocs,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/* Internal implementation of Query:
  https://github.com/firebase/firebase-js-sdk/blob/c5f08a9bc5da0d2b0207802c972d53724ccef055/packages/firestore/src/lite-api/reference.ts#L143
*/
export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    }
  }
}

export interface UseCollectionOptions {
  getDocs?: boolean;
  noContent?: boolean;
}

/**
 * React hook to subscribe to a Firestore collection or query.
 * Can operate in real-time (onSnapshot) or one-time fetch (getDocs).
 *
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemoFirebase to memoize it per React guidance.
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} memoizedTargetRefOrQuery -
 * The Firestore CollectionReference or Query. Waits if null/undefined.
 * @param {UseCollectionOptions} [options] - Options to control fetching behavior.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
  memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & { __memo?: boolean }) | null | undefined,
  options?: UseCollectionOptions
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const handleSuccess = (snapshot: QuerySnapshot<DocumentData>) => {
      const results: ResultItemType[] = [];
       for (const doc of snapshot.docs) {
          if (options?.noContent) {
            // If noContent is true, we just need the ID and slug (or other metadata)
            const { id, slug, date } = doc.data();
            results.push({ id: doc.id, slug, date } as ResultItemType);
          } else {
            results.push({ ...(doc.data() as T), id: doc.id });
          }
        }
      setData(results);
      setError(null);
      setIsLoading(false);
    };

    const handleError = (error: FirestoreError) => {
      const path: string =
        memoizedTargetRefOrQuery.type === 'collection'
          ? (memoizedTargetRefOrQuery as CollectionReference).path
          : (memoizedTargetRefOrQuery as unknown as InternalQuery)._query.path.canonicalString()

      const contextualError = new FirestorePermissionError({
        operation: 'list',
        path,
      })

      setError(contextualError)
      setData(null)
      setIsLoading(false)

      errorEmitter.emit('permission-error', contextualError);
    };

    if (options?.getDocs) {
      // One-time fetch
      getDocs(memoizedTargetRefOrQuery).then(handleSuccess).catch(handleError);
      return; // No unsubscribe needed
    } else {
      // Real-time subscription
      const unsubscribe = onSnapshot(
        memoizedTargetRefOrQuery,
        handleSuccess,
        handleError
      );
      return () => unsubscribe();
    }

  }, [memoizedTargetRefOrQuery, options?.getDocs, options?.noContent]);

  if (memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo) {
    throw new Error(memoizedTargetRefOrQuery + ' was not properly memoized using useMemoFirebase');
  }

  return { data, isLoading, error };
}
