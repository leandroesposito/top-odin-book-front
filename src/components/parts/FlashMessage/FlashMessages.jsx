import FlashMessage from "./FlashMessage";

export default function FlashMessages({ data, errors }) {
  const { message } = data || {};

  if (errors.length === 0 && !message) {
    return null;
  }

  return (
    <div className="flash-messages">
      {Array.isArray(errors) &&
        errors.map((error, index) => (
          <FlashMessage message={error} type={"error"} key={index} />
        ))}
      {typeof message !== "undefined" && (
        <FlashMessage message={data.message} type={"success"} />
      )}
    </div>
  );
}
