import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";

export default function NotFound() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div
        id="error-page"
        className="grid text-mono text-6xl place-items-center"
      >
        <h1>
          Oops! Error {error.status} occurred: {error.statusText}
        </h1>
        {error.data?.message && (
          <p>
            <i>{error.data.message}</i>
          </p>
        )}
        <Link to="/" className="underline-offset-2 text-blue-400">
          Go back home?
        </Link>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div id="error-page">
        <h1>Oops! Unexpected Error</h1>
        <p>Something went wrong.</p>
        <p>
          <i>{error.message}</i>
        </p>
      </div>
    );
  } else {
    return <div>Funny seeing you here.</div>;
  }
}
