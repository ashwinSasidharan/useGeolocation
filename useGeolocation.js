import { useEffect, useState } from "react";

function useGeolocation(errorUpdater, loadingUpdater, invoker) {
  const [position, setPosition] = useState({});
  useEffect(
    function () {
      if (!navigator.geolocation)
        return errorUpdater?.("Your browser does not support geolocation");

      loadingUpdater(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          loadingUpdater?.(false);
        },
        (error) => {
          errorUpdater?.(error.message);
          loadingUpdater?.(false);
        }
      );
    },
    [invoker, errorUpdater, loadingUpdater]
  );

  return position;
}

export default function Challenge() {
  const [isLoading, setIsLoading] = useState(false);
  const [countClicks, setCountClicks] = useState(0);

  const [error, setError] = useState(null);

  const position = useGeolocation(setError, setIsLoading, countClicks);
  const { lat, lng } = position;

  function getPosition() {
    setCountClicks((count) => count + 1);
  }

  return (
    <div>
      <button onClick={getPosition} disabled={isLoading}>
        Get my position
      </button>

      {isLoading && <p>Loading position...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && lat && lng && countClicks > 0 && (
        <p>
          Your GPS position:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
          >
            {lat}, {lng}
          </a>
        </p>
      )}

      <p>You requested position {countClicks} times</p>
    </div>
  );
}
