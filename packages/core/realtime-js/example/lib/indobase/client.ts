import { createBrowserClient } from "@indobase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_INDOBASE_URL!,
    process.env.NEXT_PUBLIC_INDOBASE_PUBLISHABLE_KEY!,
  );
}
