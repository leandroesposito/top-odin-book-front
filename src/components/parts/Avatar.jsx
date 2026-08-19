import { Link } from "react-router";
import "./Avatar.css";

export default function Avatar({ data, size = 2, addAnchor = true }) {
  const user = {
    ...data,
    name: data.name || data.author,
    id: data.user_id || data.userId || data.id,
  };

  const divStyle = {
    fontSize: `${size}rem`,
    width: "1em",
    height: "1em",
    borderRadius: "50%",
  };

  const avatarContent =
    user.profile_picture_url !== null ? (
      <img src={user.profile_picture_url} alt="avatar" />
    ) : (
      <div className="avatar-replacement">
        {user.name.substring(0, 1).toUpperCase()}
      </div>
    );

  return (
    <div className="avatar-container" aria-label="avatar" style={divStyle}>
      {addAnchor ? (
        <Link to={`/profile/${user.id}`}>{avatarContent}</Link>
      ) : (
        avatarContent
      )}
    </div>
  );
}
