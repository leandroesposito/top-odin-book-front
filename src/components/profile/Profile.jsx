import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import FlashMessage from "../parts/FlashMessage/FlashMessage";
import { useParams } from "react-router";
import Posts from "../post/Posts";
import { getUserId } from "../../session/sessionManager";

function Profile() {
  const { data, errors, makeRequest } = useFetch();
  const { userId } = useParams();

  useEffect(() => {
    makeRequest(`/profiles/${userId}`, "GET");
  }, [makeRequest, userId]);

  return (
    <div className="profile">
      {typeof data?.profile !== "undefined" && (
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar">
              <img
                src={data.profile.profilePictureUrl}
                alt={`${data.profile.name}'s avatar`}
              />
            </div>
          </div>
          <div className="profile-description">
            <div className="name">
              {data.profile.name}
              {data.profile.userId === getUserId() && (
                <a href="/profile/edit" className="button">
                  Edit profile
                </a>
              )}
            </div>
            <div className="profession">{data.profile.profession}</div>
            <div className="bio">{data.profile.bio}</div>
            <div className="friends">Friends: {data.profile.friendsCount}</div>
          </div>
        </div>
      )}
      <div className="flash-messages">
        {errors.map((error, index) => (
          <FlashMessage message={error} type={"error"} key={index} />
        ))}
        {data !== null && typeof data.message !== "undefined" && (
          <FlashMessage message={data.message} type={"success"} />
        )}
      </div>
      <Posts userId={userId} />
    </div>
  );
}

export default Profile;
