import { unstable_cache } from "next/cache";

const BIGINT_MARKER = "__bigint__";

// Serialize supporting bigint
function makeSerializable(data: any): any {
  if (data == null || data == undefined) {
    return data;
  }

  if (typeof data === "bigint") {
    return { [BIGINT_MARKER]: data.toString() };
  } else if (Array.isArray(data)) {
    return data.map(makeSerializable);
  } else if (typeof data === "object") {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, makeSerializable(value)]));
  }
  return data;
}

// Deserialize supporting bigint
function customDeserialize(serializedData: any): any {
  if (Array.isArray(serializedData)) {
    return serializedData.map(customDeserialize);
  } else if (serializedData && typeof serializedData === "object") {
    if (BIGINT_MARKER in serializedData) {
      return BigInt(serializedData[BIGINT_MARKER]);
    } else {
      return Object.fromEntries(Object.entries(serializedData).map(([key, value]) => [key, customDeserialize(value)]));
    }
  } else return serializedData;
}

// Make bigint serializable via toJSON
// Needed since unstable cache requires serializable params for cache ke
// I.e this allows bigint params to be used as callback function inputs
interface BigInt {
  /** Convert to BigInt to string form in JSON.stringify */
  toJSON: () => string;
}
BigInt.prototype.toJSON = function () {
  return this.toString();
};

type Callback = (...args: any[]) => Promise<any>;
export function customUnstableCache<T extends Callback>(
  cb: T,
  keyParts?: string[],
  options?: {
    revalidate?: number | false;
    tags?: string[];
  }
): T {
  return async function (...args: Parameters<T>): Promise<ReturnType<T>> {
    const serializedFn = async (...args: Parameters<T>): Promise<string> => {
      const result = await cb(...args);
      const serializableResult = makeSerializable(result);
      return serializableResult;
    };

    const cachedData = await unstable_cache(serializedFn, keyParts, options)(...args);
    return customDeserialize(cachedData) as ReturnType<T>;
  } as T;
}
