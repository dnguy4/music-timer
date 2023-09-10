import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";

export default function NotFound() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div
        id="error-page"
        className="flex flex-col h-screen text-mono text-5xl text-center gap-2"
      >
        <h1 className="text-6xl">Oops! Something went wrong.</h1>
        <FontAwesomeIcon className="pt-1" icon={faExclamationCircle} />

        <div className="h-full grid place-items-center">
          <div>
            <h2>
              Error {error.status} occurred: {error.statusText}
            </h2>
            {error.data?.message && (
              <p>
                <i>{error.data.message}</i>
              </p>
            )}
            <Link to="/" className="underline-offset-2 text-blue-400">
              Go back home?
            </Link>
          </div>
        </div>
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
