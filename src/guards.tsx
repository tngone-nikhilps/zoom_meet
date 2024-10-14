import { LoaderFunctionArgs, redirect } from "react-router-dom";

export function authGuard(_args: LoaderFunctionArgs): Response | null {
  const storageItem = localStorage.getItem("auth-storage");
  const parsedResult = storageItem ? JSON.parse(storageItem) : null;
  if (!parsedResult?.state.userId) {
    return redirect("/");
  }
  return null;
}

export function returnGuard(_args: LoaderFunctionArgs): Response | null {
  const storageItem = localStorage.getItem("auth-storage");
  const parsedResult = storageItem ? JSON.parse(storageItem) : null;
  if (parsedResult?.state.userId) {
    return redirect("/dashboard");
  }
  return null;
}
export function paymentGuard(_args: LoaderFunctionArgs): Response | null {
  const storageItem = localStorage.getItem("auth-storage");
  const parsedResult = storageItem ? JSON.parse(storageItem) : null;
  if (parsedResult?.state.userId) {
    return redirect("/dashboard");
  }
  return null;
}
export function roleGuard(
  roles: string[],
  _args: LoaderFunctionArgs
): Response | null {
  const storageItem = localStorage.getItem("auth-storage");
  const parsedResult = storageItem ? JSON.parse(storageItem) : null;
  const roleAuthenticated = roles.includes(parsedResult?.state.userRole);
  if (!parsedResult?.state.userId || !roleAuthenticated) {
    return redirect("/");
  }
  return null;
}
